var fs = require('fs');
var path = require('path');

var test = require('tape');

/**
 * Import specs
 */

var dirs = ['', 'basic'];

dirs.forEach((dir) => {
  let where = './tests/specs/' + dir;
  if (fs.existsSync(where)) {
    fs.readdirSync(where).forEach((file) => {
      if (path.extname(file) === '.js') {
        require(path.join('.' + where, file));
      }
    });
  }
});

test.onFinish(process.exit);
