// writeFile

const {
  writeFileSync,
} = require('fs');

const writeFile = (f, content) => {
  return writeFileSync(f, content, 'utf8');
};

module.exports = writeFile;
