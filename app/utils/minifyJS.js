// minifyJS

var UglifyJS = require('uglify-js');

var minifyJS = (jscode) => {
  let u = UglifyJS.minify(jscode, {
    fromString: true
  });
  return u.code;
};

module.exports = minifyJS;
