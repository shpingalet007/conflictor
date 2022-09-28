import args from '../src/new/args.js';
import Conflictor from "../src/new/index.js";

const conflictor = new Conflictor(args);
const result = conflictor.runAnalyze();

if (result.constructor.name === 'Error') {
  console.log(result.message);
  process.exit();
}

console.log('----- PULL REQUESTS STATS ------');
console.log(JSON.stringify(result, null, 2));
