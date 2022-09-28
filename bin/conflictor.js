import args from '../src/args.js';
import Conflictor from '../src/index.js';

const conflictor = new Conflictor(args);
const result = await conflictor.runAnalyze();

if (result?.constructor.name === 'Error') {
  console.log(result.message);
  process.exit();
}

console.log('----- PULL REQUESTS STATS ------');
console.log(JSON.stringify(result, null, 2));
