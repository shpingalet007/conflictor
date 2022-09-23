import core from '@actions/core';
import args from './args.js';
import conflictor from './index.js';

async function actionConflictor() {
  try {
    core.info(`Repository set to: ${args.repo}`);
    core.info(`Main branch name: ${args.mainBranch}`);
    core.info(`Using deploy label: ${args.marker}`);

    const pullStats = await conflictor(args);

    core.setOutput('stats', pullStats);
  } catch (error) {
    core.setFailed(error);
  }
}

await actionConflictor();
