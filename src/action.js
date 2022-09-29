import core from '@actions/core';
import args from '../src/libs/args.js';
import Conflictor from '../src/main.js';

try {
  core.info(`Repository set to: ${args.repo}`);
  core.info(`Main branch name: ${args.mainBranch}`);
  core.info(`Using deploy label: ${args.marker}`);
  core.info('Using current folder as git project');

  const pullStats = await Conflictor.analyze(args);

  console.log('----- PULL REQUESTS STATS ------');
  console.log(pullStats);

  core.setOutput('stats', pullStats);
} catch (error) {
  core.setFailed(error);
}
