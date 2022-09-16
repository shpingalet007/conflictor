import yargs from 'yargs';

const argv = yargs(process.argv)
  .option('project', {
    alias: 'p',
    describe: 'Provide GIT project path',
    default: '.',
    type: 'string',
  })
  .option('repo', {
    alias: 'r',
    describe: 'Repository name',
    type: 'string',
  })
  .option('marker', {
    alias: 'm',
    description: 'Deploy label',
    type: 'string',
  })
  .option('base', {
    alias: 'b',
    description: 'Provide manually which base is used',
    describe: 'merge_commit_1',
    type: 'string',
  })
  .option('analyze', {
    alias: 'a',
    description: 'Provide manually which pull requests must be checked',
    describe: '[merge_commit_1, merge_commit_2, ..., merge_commit_N]',
    type: 'string',
  })
  .option('graph', {
    alias: 'g',
    description: 'Output merge variants graph (PNG image)',
    type: 'boolean',
  })
  .demandOption(['repo', 'marker'])
  .help()
  .version()
  .alias('help', 'h').argv;

export default argv;
