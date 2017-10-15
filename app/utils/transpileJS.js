// transpileJS

var babel = require('babel-core');

const {
  name
} = require('../../package.json');

const debug = require('debug');
const info = debug(`${name}:info`);

var transpile = (code) => {
  info('Transpiling with Babel...');
  let r = babel.transform(code, {
    presets: [
      [
        'env', {
          targets: {
            browsers: [
              'safari 9',
              'ie 11',
              'Android 4',
              'iOS 7'
            ]
          }
        }
      ]
    ],
    plugins: [
      'transform-remove-strict-mode'
    ],
    comments: false,
    sourceMaps: true
  });

  info('Transpiling finished');
  return r.code;
};

module.exports = transpile;
