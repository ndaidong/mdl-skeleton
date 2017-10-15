// parseJS

var fs = require('fs');

const {
  name
} = require('../../package.json');

const debug = require('debug');
const info = debug(`${name}:info`);
const error = debug(`${name}:error`);

var rollup = require('rollup');

var babel = require('rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');

var minifyJS = require('./minifyJS');

var writeFile = require('./writeFile');

var config = require('../../configs');
var {
  assetsDirs,
  distDir
} = config.settings;

var {
  ENV
} = config;

var getRealPath = (file) => {
  let arr = [file].concat(assetsDirs.map((dir) => {
    return `${dir}/${file}`;
  }));

  for (let i = 0; i < arr.length; i++) {
    let f = arr[i];
    if (fs.existsSync(f)) {
      return f;
    }
  }

  return false;
};

var rollupify = (input, otherCode = '', output) => {
  info('Rollup start...');
  rollup.rollup({
    input,
    plugins: [
      nodeResolve({
        jsnext: true,
        main: true,
        extensions: [
          '.js',
          '.json'
        ]
      }),
      commonjs({
        include: 'node_modules/**'
      }),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          'es2015-rollup'
        ],
        plugins: [
          'external-helpers'
        ]
      })
    ]
  }).then(async (bundle) => {
    info('Generating code with bundle...');
    let {code} = await bundle.generate({
      format: 'iife',
      name: 'app'
    });
    info('Rolling finished. Write to file...');

    let js = [
      otherCode,
      ENV === 'production' ? minifyJS(code) : code
    ].join('\n');

    writeFile(output, js);
  }).catch((err) => {
    error(err);
  });
};

var rollupJS = (jsEntry, otherCode = '', pathMD5 = '') => {
  info(`Start rolling up JS...`);
  let realPath = getRealPath(jsEntry);

  if (!realPath) {
    return false;
  }

  let publicPath = `/js/${pathMD5}.js`;
  let fileToSave = `${distDir}${publicPath}`;

  if (ENV === 'production' && fs.existsSync(fileToSave)) {
    info(`Use already rollupified file ${fileToSave}`);
    return publicPath;
  }

  rollupify(realPath, otherCode, fileToSave);

  return publicPath;
};

module.exports = rollupJS;
