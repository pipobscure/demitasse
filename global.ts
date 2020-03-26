import * as path from 'path';
import { pathToFileURL } from 'url';
import * as pieces from './index.js';
Object.assign(global, pieces);

const testurl = pathToFileURL(path.resolve(process.argv[2])).toString();
// console.error(testurl);
import(testurl).catch((err) => {
  console.error(err);
  process.exit(4);
});
