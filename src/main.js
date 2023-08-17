import fs from 'fs';
import artifact from '@actions/artifact';
import visualize from './libs/visualizer.js';
import { fetchPulls } from './libs/fetch-pulls.js';
import { exec } from 'child_process';

const appDir = process.cwd();

export default class Conflictor {
  static CrossMergerPath = `${appDir}/src/libs/cross-merge.sh`;

  static RegExp = {
    DirectImpact: />>> DIRECT IMPACT.*$\n(.*\n)*?>>> END/gm,
    SideImpact: />>> SIDE IMPACT.*$\n(.*\n)*?>>> END/gm,
    MasterSha: />>> MASTER BRANCH SHA \[(.+)\]$/m,
    Error: />>> ERROR \[(.+)\]$/m,
  };

  constructor(args) {
    this.args = args;

    this.initialized = new Promise((resolve) => {
      this.initialize()
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          resolve(false);
          console.error(err);
        });
    });
  }

  async initialize() {
    this.pullsData = await fetchPulls(this.args.repo, this.args.marker);

    console.log(this.pullsData);

    this.shaList = this.pullsData.map(p => p.sha);
    this.titlesList = this.pullsData.map(p => p.title);

    if (!this.pullsData.length) {
      throw Error('NO PULLS TO MERGE');
    }
  }

  async runAnalyze() {
    const isInitialized = await this.initialized;

    if (!isInitialized) {
      console.error('Conflictor was not able to initialize');
      return;
    }

    const execCommand = this.getExecCommand();

    return new Promise((resolve) => {
      exec(execCommand, (err, sout, serr) => (
        this.processExecOutput(err, sout, serr)
          .then(async (result) => {
            await this.runOutput(result);
            resolve(result.pullStats);
          })
          .catch((err) => {
            resolve(err);
            console.error(err);
          })
      ));
    });
  }

  async processExecOutput(error, stdout, stderr) {
    if (error || stderr) {
      throw error || stderr;
    }

    if (this.args.debug) {
      console.log('BASH Debug information:', error, stdout, stderr);
    }

    const errorReceived = stdout.match(Conflictor.RegExp.Error)?.[1];

    if (errorReceived) {
      throw Error(errorReceived);
    }

    const mainBranchSha = stdout.match(Conflictor.RegExp.MasterSha)[1];

    this.shaList.push(mainBranchSha);
    this.titlesList.push(this.args.mainBranch);

    const changes = [];
    const conflicts = [];
    const intersected = [];
    const mergeOrder = [];

    stdout.match(Conflictor.RegExp.DirectImpact).forEach((pull) => {
      const pulls = pull.split('\n');

      const pullId = pulls[0].match(/\d+/g);

      pulls.shift();
      pulls.pop();

      changes[Number.parseInt(pullId)] = [...new Set(pulls)];
    });

    stdout.match(Conflictor.RegExp.SideImpact).forEach((pair) => {
      const pairs = pair.split('\n');

      const pairId = pairs[0].match(/\d+:\d+/g);

      pairs.shift();
      pairs.pop();

      conflicts[pairId] = pairs;
    });

    Object.keys(conflicts).forEach((conflictPair) => {
      const conflictsList = conflicts[conflictPair];

      conflictsList.forEach((conflict) => {
        const pairIds = conflictPair.split(':');

        if (typeof intersected[conflictPair] !== 'object') {
          intersected[conflictPair] = {};
          intersected[conflictPair][pairIds[0]] = [];
          intersected[conflictPair][pairIds[1]] = [];
        }

        intersected[conflictPair][Number.parseInt(pairIds[0])] = changes[pairIds[0]].filter(c => c === conflict);

        if (pairIds[1] != Object.keys(changes).length) {
          intersected[conflictPair][Number.parseInt(pairIds[1])] = changes[pairIds[1]].filter(c => c === conflict);
        }
      });
    });

    this.shaList.forEach((pull, i) => {
      if (i === this.shaList.length - 1) {
        return;
      }

      const pullConflicts = Object.keys(intersected)
        .filter(c => (c[0] == i || c[2] == i));

      if (!pullConflicts.length) {
        mergeOrder.push({
          title: this.titlesList[i],
          sha: this.shaList[i],
          conflictLevel: 0,
          concurrency: [],
        });

        return;
      }

      const conflictedPullsList = [...new Set(pullConflicts.join(':').split(':'))];

      // Pre-population of second order
      conflictedPullsList.forEach((i) => {
        const pullIndex = mergeOrder.findIndex(c => c.sha === this.shaList[i]);

        if (pullIndex !== -1 || Number.parseInt(i) >= this.shaList.length - 1) {
          return;
        }

        mergeOrder.push({
          title: this.titlesList[i],
          sha: this.shaList[i],
          conflictLevel: 0,
          concurrency: [],
        });
      });

      pullConflicts.forEach((pair) => {
        let concurrent = pair.split(':');

        const pull1Index = mergeOrder.findIndex(c => c.sha === this.shaList[concurrent[0]]);
        const pull2Index = mergeOrder.findIndex(c => c.sha === this.shaList[concurrent[1]]);

        const isPull1Affected = (intersected[pair][concurrent[0]].length > 0);
        const isPull2Affected = (intersected[pair][concurrent[1]].length > 0);

        if (isPull1Affected || pull2Index === -1) {
          const alreadyListed = (mergeOrder[pull1Index].concurrency.findIndex(c => (
            c.sha === this.shaList[concurrent[1]]
          )) !== -1);

          if (!alreadyListed) {
            mergeOrder[pull1Index].conflictLevel++;

            mergeOrder[pull1Index].concurrency.push({
              title: this.titlesList[concurrent[1]],
              sha: this.shaList[concurrent[1]],
            });
          }
        }

        if (isPull2Affected) {
          const alreadyListed = (mergeOrder[pull2Index].concurrency.findIndex(c => (
            c.sha === this.shaList[concurrent[0]]
          )) !== -1);

          if (!alreadyListed) {
            mergeOrder[pull2Index].conflictLevel++;

            mergeOrder[pull2Index].concurrency.push({
              title: this.titlesList[concurrent[0]],
              sha: this.shaList[concurrent[0]],
            });
          }
        }
      });
    });

    const sortByConflictLevel = ((b, a) => (a.conflictLevel > b.conflictLevel) ? -1 : 1);

    const pullStats = mergeOrder.sort(sortByConflictLevel).map((m) => {
      let comments = 'Resolve conflicts between branches';

      if (m.conflictLevel === 0) {
        comments = 'No conflicts, can be merged';
      } else if (m.concurrency.some(c => c.title === 'master')) {
        comments = 'Rebase on master or do merge commit';
      }

      if (m.conflictLevel === 0) {
        delete m.conflictLevel;
        delete m.concurrency;
      }

      m.comments = comments;
      m.pullNumber = this.pullsData.find(p => p.sha === m.sha).pullNumber;

      return m;
    });

    return { mainBranchSha, pullStats };
  }

  async runOutput(result) {
    const artifacts = [];

    const artifactClient = artifact.create();

    if (this.args.graph) {
      await visualize(result.pullStats, result.mainBranchSha);

      if (this.args.isActions) {
        artifacts.push('graph.svg');
      }
    }

    if (this.args.json) {
      fs.writeFileSync('stats.json', JSON.stringify(result.pullStats, null, 4));

      if (this.args.isActions) {
        artifacts.push('stats.json');
      }
    }

    if (this.args.isActions) {
      await artifactClient.uploadArtifact('statistics', artifacts, appDir);
    }
  }

  static async analyze(args) {
    const conflictor = new Conflictor(args);
    return await conflictor.runAnalyze();
  }

  getExecCommand() {
    let preCommands = [];

    if (this.args.base) {
      const setConflictorMainSha = `export CONFLICTOR_MASTER_SHA=${this.args.base}`;
      preCommands.push(setConflictorMainSha);
    }

    if (this.args.mainBranch) {
      const setConflictorMainBranch = `export CONFLICTOR_MAIN_BRANCH=${this.args.mainBranch}`
      preCommands.push(setConflictorMainBranch);
    }

    const goToProjectFolder = `cd ${this.args.project}`;
    preCommands.push(goToProjectFolder);

    preCommands.push(`${Conflictor.CrossMergerPath} ${this.shaList.join(' ')}`);

    return preCommands.join(' && ');
  }
}
