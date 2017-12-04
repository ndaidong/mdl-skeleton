// delFile

const {
  existsSync,
  unlinkSync,
} = require('fs');

const delFile = (f) => {
  return existsSync(f) ? unlinkSync(f) : false;
};

module.exports = delFile;
