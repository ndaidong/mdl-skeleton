/**
 * scripts/builder
 * @ndaidong
 **/

var fs = require('fs');
var exec = require('child_process').execSync;

var mkdirp = require('mkdirp').sync;

var log = console.log;

var pkg = require('../package');

var isUrl = (v) => {
  return v.startsWith('https://') || v.startsWith('http://');
};

var download = (src, saveas) => {
  if (fs.existsSync(saveas)) {
    fs.unlink(saveas);
  }
  log('Downloading %s ...', src);
  exec('wget -O ' + saveas + ' ' + src);
  log('Downloaded %s', saveas);
};

var prepareResources = (res, dir) => {
  let {
    css,
    js
  } = res;

  for (let alias in css) {
    if (isUrl(css[alias])) {
      let src = css[alias];
      let dest = `${dir}/css/${alias}.css`;
      if (!fs.existsSync(dest)) {
        download(src, dest);
      }
    }
  }
  for (let alias in js) {
    if (isUrl(js[alias])) {
      let src = js[alias];
      let dest = `${dir}/js/${alias}.js`;
      if (!fs.existsSync(dest)) {
        download(src, dest);
      }
    }
  }
};

var setup = (config) => {

  let {distDir, storeDir} = config.settings;
  [
    storeDir,
    `${storeDir}/sessions`,
    distDir,
    `${distDir}/css`,
    `${distDir}/js`,
    `${distDir}/images`,
    `${distDir}/fonts`,
    `${distDir}/vendor`,
    `${distDir}/vendor/css`,
    `${distDir}/vendor/js`
  ].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      mkdirp(dir);
    }
  });

  prepareResources(pkg.setup, `${distDir}/vendor`);
};

var reset = (config) => {
  let {distDir, storeDir} = config.settings;

  [
    distDir,
    storeDir,
    'node_modules',
    'coverage',
    '.nyc_output'
  ].forEach((dir) => {
    if (fs.existsSync(dir)) {
      exec('rm -rf ' + dir);
    }
  });

  [
    'npm-error.log',
    'yarn.lock'
  ].forEach((file) => {
    if (fs.existsSync(file)) {
      exec('rm ' + file);
    }
  });
};

module.exports = {
  setup,
  reset
};
