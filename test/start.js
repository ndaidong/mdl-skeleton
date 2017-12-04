/**
 * Import specs
 */

const {
  existsSync,
  readdirSync,
} = require('fs');

const {
  join,
  extname,
} = require('path');

const test = require('tape');

const where = './test/specs';
if (existsSync(where)) {
  readdirSync(where).forEach((file) => {
    if (extname(file) === '.js') {
      require(join('.' + where, file));
    }
  });
}

test.onFinish(process.exit);
