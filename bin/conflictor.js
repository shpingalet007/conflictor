import args from '../args.js';
import conflictor from '../index.js';

const result = await conflictor(args);

if (result.constructor.name === 'Error') {
  console.log(result.message);
  process.exit();
}

console.log('----- PULL REQUESTS STATS ------');
console.log(JSON.stringify(result, null, 2));
