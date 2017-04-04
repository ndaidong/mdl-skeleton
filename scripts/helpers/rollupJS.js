// parseJS

var fs = require('fs');
var debug = require('debug');
var info = debug('app:info');
var error = debug('app:error');

var rollup = require('rollup');

var babel = require('rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var uglify = require('rollup-plugin-uglify');

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

var rollupify = (entry, otherCode = '', output) => {
  info('Rollup start...');
  rollup.rollup({
    entry,
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
      }),
      ENV === 'production' && uglify()
    ]
  }).then((bundle) => {
    info('Generating code with bundle...');
    let result = bundle.generate({
      format: 'iife',
      moduleName: 'app'
    });
    info('Rolling finished. Write to file...');
    writeFile(output, otherCode + '\n' + result.code);
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