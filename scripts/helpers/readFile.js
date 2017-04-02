// readFile

var fs = require('fs');

var readFile = (f) => {
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
};

module.exports = readFile;
