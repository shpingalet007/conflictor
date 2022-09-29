import args from '../src/libs/args.js';
import Conflictor from '../src/index.js';

const result = await Conflictor.analyze(args);

if (result?.constructor.name === 'Error') {
  console.log(result.message);
  process.exit();
}

console.log('----- PULL REQUESTS STATS ------');
console.log(JSON.stringify(result, null, 2));
