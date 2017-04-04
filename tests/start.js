var fs = require('fs');
var path = require('path');

var test = require('tape');

/**
 * Import specs
 */

var dirs = ['', 'helpers', 'pages', 'serving'];

dirs.forEach((dir) => {
  let where = './tests/specs/' + dir;
  if (fs.existsSync(where)) {
    fs.readdirSync(where).forEach((file) => {
      if (file.endsWith('.specs.js')) {
        require(path.join('.' + where, file));
      }
    });
  }
});

test.onFinish(process.exit);
