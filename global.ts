import * as pieces from './index.js';
Object.assign(global, pieces);

import(process.argv[2]).catch((err) => {
  console.error(err);
  process.exit(4);
});
