const { writeFileSync, copyFileSync } = require('fs');

const PKG = require('./package.json');
['bdd', 'run', 'tap', 'pretty', 'json' ].forEach((mod) => {
  const BNDL = require(`./${mod}/package.json`);
  BNDL.version = PKG.version;
  writeFileSync(`./${mod}/package.json`, JSON.stringify(BNDL, undefined, '  '));
  copyFileSync('README.md', `./${mod}/README.md`);
  copyFileSync('LICENSE.md', `./${mod}/LICENSE.md`);
  copyFileSync('RATIONALE.md', `./${mod}/RATIONALE.md`);
});

const BNDL = require(`./options/package.json`);
BNDL.version = PKG.version;
writeFileSync(`./options/package.json`, JSON.stringify(BNDL, undefined, '  '));
