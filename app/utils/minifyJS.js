// minifyJS

const {
  name
} = require('../../package.json');

const debug = require('debug');
const error = debug(`${name}:error`);

const {minify} = require('uglify-es');

var minifyJS = (jscode) => {
  let result = minify(jscode);
  let {
    error: err,
    code
  } = result;

  if (err) {
    error(err);
  }
  return code;
};

module.exports = minifyJS;
