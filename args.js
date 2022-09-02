import yargs from 'yargs';

const argv = yargs(process.argv)
  .option('project', {
    describe: 'Provide GIT project path',
    demandOption: true,
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
  .help()
  .version()
  .alias('help', 'h').argv;

export default argv;
