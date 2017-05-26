// delFile

var fs = require('fs');

var delFile = (f) => {
  return fs.unlinkSync(f);
};

module.exports = delFile;
