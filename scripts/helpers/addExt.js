// addExt

var path = require('path');

var addExt = (f, type = 'js') => {
  let part = path.parse(f);
  if (!part.ext) {
    return `${f}.${type}`;
  }
  return f;
};

module.exports = addExt;
