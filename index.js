import artifact from '@actions/artifact';
import { exec } from 'child_process';
import { fetchPulls } from './fetch-pulls.js';

import visualize from './visualizer.js';
import fs from "fs";

const appDir = process.cwd();

export default async function conflictor(args) {
  let directImpactsRegex = />>> DIRECT IMPACT.*$\n(.*\n)*?>>> END/gm;
  let sideImpactsRegex = />>> SIDE IMPACT.*$\n(.*\n)*?>>> END/gm;
  let masterShaRegex = />>> MASTER BRANCH SHA \[(.+)\]$/m;
  let errorRegex = />>> ERROR \[(.+)\]$/m;

  let changes = {};
  let conflicts = {};
  let intersected = {};
  let mergeOrder = [];

  let optionalCommands = '';
  const projectFolder = `cd ${args.project}`;
  const runScript = '/Users/developer/Documents/GitHub/conflictor/Conflictor/conflicts.sh';

  if (args.base) {
    optionalCommands += `export CONFLICTOR_MASTER_SHA=${args.base} &&`;
  }

  if (args.mainBranch) {
    optionalCommands += `export CONFLICTOR_MAIN_BRANCH=${args.mainBranch} &&`
  }

  const pullsData = await fetchPulls(args.repo, args.marker);

  if (!pullsData.length) {
    return Promise.resolve(Error('NO PULLS TO MERGE'));
  }

  const shaList = pullsData.map(p => p.sha);
  const titlesList = pullsData.map(p => p.title);

  if (args.debug) {
    console.log('Pulls to analyze:', pullsData);
  }

  return new Promise((resolve, reject) => {
    exec(`${optionalCommands}${projectFolder} && ${runScript} ${shaList.join(' ')}`, async (error, stdout, stderr) => {
      if (args.debug) {
        console.log('BASH Debug information:', error, stdout, stderr);
      }

      const errorReceived = stdout.match(errorRegex)?.[1];

      if (errorReceived) {
        throw Error(errorReceived);
      }

      const mainBranchSha = stdout.match(masterShaRegex)[1];

      shaList.push(mainBranchSha);
      titlesList.push(args.mainBranch);

      stdout.match(directImpactsRegex).forEach((pull) => {
        const pulls = pull.split('\n');

        const pullId = pulls[0].match(/\d+/g);

        pulls.shift();
        pulls.pop();

        changes[Number.parseInt(pullId)] = [...new Set(pulls)];
      });

      stdout.match(sideImpactsRegex).forEach((pair) => {
        const pairs = pair.split('\n');

        const pairId = pairs[0].match(/\d+:\d+/g);

        pairs.shift();
        pairs.pop();

        conflicts[pairId] = pairs;
      });

      Object.keys(conflicts)
        .forEach((conflictPair) => {
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

      shaList.forEach((pull, i) => {
        if (i === shaList.length - 1) {
          return;
        }

        const pullConflicts = Object.keys(intersected)
          .filter(c => (c[0] == i || c[2] == i));

        if (!pullConflicts.length) {
          mergeOrder.push({
            title: titlesList[i],
            sha: shaList[i],
            conflictLevel: 0,
            concurrency: [],
          });

          return;
        }

        const conflictedPullsList = [...new Set(pullConflicts.join(':').split(':'))];

        // Pre-population of second order
        conflictedPullsList.forEach((i) => {
          const pullIndex = mergeOrder.findIndex(c => c.sha === shaList[i]);

          if (pullIndex !== -1 || Number.parseInt(i) >= shaList.length - 1) {
            return;
          }

          mergeOrder.push({
            title: titlesList[i],
            sha: shaList[i],
            conflictLevel: 0,
            concurrency: [],
          });
        });

        pullConflicts.forEach((pair) => {
          let concurrent = pair.split(':');

          const pull1Index = mergeOrder.findIndex(c => c.sha === shaList[concurrent[0]]);
          const pull2Index = mergeOrder.findIndex(c => c.sha === shaList[concurrent[1]]);

          const isPull1Affected = (intersected[pair][concurrent[0]].length > 0);
          const isPull2Affected = (intersected[pair][concurrent[1]].length > 0);

          if (isPull1Affected || pull2Index === -1) {
            const alreadyListed = (mergeOrder[pull1Index].concurrency.findIndex(c => (
              c.sha === shaList[concurrent[1]]
            )) !== -1);

            if (!alreadyListed) {
              mergeOrder[pull1Index].conflictLevel++;

              mergeOrder[pull1Index].concurrency.push({
                title: titlesList[concurrent[1]],
                sha: shaList[concurrent[1]],
              });
            }
          }

          if (isPull2Affected) {
            const alreadyListed = (mergeOrder[pull2Index].concurrency.findIndex(c => (
              c.sha === shaList[concurrent[0]]
            )) !== -1);

            if (!alreadyListed) {
              mergeOrder[pull2Index].conflictLevel++;

              mergeOrder[pull2Index].concurrency.push({
                title: titlesList[concurrent[0]],
                sha: shaList[concurrent[0]],
              });
            }
          }
        });
      });

      const sortByConflictLevel = ((b, a) => (a.conflictLevel > b.conflictLevel) ? -1 : 1);

      const pullStats = mergeOrder.sort(sortByConflictLevel)
        .map((m) => {
          let comments = '';

          if (m.conflictLevel === 0) {
            comments = 'No conflicts, can be merged';
          } else if (m.concurrency.some(c => c.title === 'master')) {
            comments = 'Rebase on master or do merge commit';
          } else {
            comments = 'Resolve conflicts between branches';
          }

          if (m.conflictLevel === 0) {
            delete m.conflictLevel;
            delete m.concurrency;
          }

          m.comments = comments;
          m.pullNumber = pullsData.find(p => p.sha === m.sha).pullNumber;

          return m;
        });

      resolve(pullStats);

      if (args.graph) {
        await visualize(pullStats, mainBranchSha);

        if (args.isActions) {
          const artifactClient = artifact.create();

          fs.writeFileSync('stats.json', JSON.stringify(pullStats, null, 4));

          await artifactClient.uploadArtifact('statistics', ['stats.json', 'graph.svg'], appDir);
        }
      }
    });
  });
}
