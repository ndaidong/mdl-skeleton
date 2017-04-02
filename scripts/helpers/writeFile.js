// writeFile

var fs = require('fs');

var writeFile = (f, content) => {
  return fs.writeFileSync(f, content, 'utf8');
};

module.exports = writeFile;
