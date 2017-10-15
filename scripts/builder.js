/**
 * scripts/builder
 * @ndaidong
 **/

var fs = require('fs');
var exec = require('child_process').execSync;

var mkdirp = require('mkdirp').sync;
var cpdir = require('copy-dir').sync;

var log = console.log; // eslint-disable-line no-console

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

var publish = (from, to) => {
  if (!fs.existsSync(from)) {
    return false;
  }
  if (fs.existsSync(to)) {
    exec('rm -rf ' + to);
  }
  mkdirp(to);
  cpdir(from, to);
  return null;
};

var prepareResources = (res = {}, dir) => {
  let {
    css = {},
    js = {}
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

  let {
    ENV,
    settings
  } = config;

  let {distDir, storeDir} = settings;

  let jsDir = `${distDir}/js`;
  let cssDir = `${distDir}/css`;

  [
    storeDir,
    `${storeDir}/sessions`,
    distDir,
    cssDir,
    jsDir,
    `${distDir}/images`,
    `${distDir}/fonts`,
    `${distDir}/vendor`,
    `${distDir}/vendor/css`,
    `${distDir}/vendor/js`
  ].forEach((dir) => {
    if (ENV === 'production') {
      if (dir === cssDir || dir === jsDir) {
        exec('rm -rf ' + dir);
      }
    }
    if (!fs.existsSync(dir)) {
      mkdirp(dir);
    }
  });

  publish('./app/assets/fonts', `${distDir}/fonts`);
  publish('./app/assets/images', `${distDir}/images`);

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
    'npm-debug.log',
    'yarn.lock',
    'package-lock.json',
    'coverage.lcov'
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
