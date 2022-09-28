import core from '@actions/core';
import args from './args.js';
import conflictor from './index.js';

async function actionConflictor() {
  try {
    core.info(`Repository set to: ${args.repo}`);
    core.info(`Main branch name: ${args.mainBranch}`);
    core.info(`Using deploy label: ${args.marker}`);
    core.info('Using current folder as git project');

    const pullStats = await conflictor(args);

    console.log('----- PULL REQUESTS STATS ------');
    console.log(pullStats);

    core.setOutput('stats', pullStats);
  } catch (error) {
    core.setFailed(error);
  }
}

await actionConflictor();
