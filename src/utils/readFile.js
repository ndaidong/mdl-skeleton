// readFile

const {
  existsSync,
  readFileSync,
} = require('fs');

const readFile = (f) => {
  return existsSync(f) ? readFileSync(f, 'utf8') : '';
};

module.exports = readFile;
