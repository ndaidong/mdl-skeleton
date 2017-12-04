#!/usr/bin/env node

const {
  existsSync,
  unlinkSync,
} = require('fs');

const {
  execSync,
} = require('child_process');

const mkdirp = require('mkdirp').sync;

const {vendor = {}} = require('../package.json');

const {
  distDir,
} = require('../src/configs');

const log = console.log; // eslint-disable-line no-console

const download = (src, saveas) => {
  if (existsSync(saveas)) {
    unlinkSync(saveas);
  }
  log('Downloading %s ...', src);
  execSync('wget -O ' + saveas + ' ' + src);
  log('Downloaded %s', saveas);
};

const prepareResources = (res = {}, dir) => {
  let {
    css = {},
    js = {},
  } = res;

  for (let alias in css) {
    if (css.hasOwnProperty(alias)) {
      let src = css[alias];
      let dest = `${dir}/css/${alias}.css`;
      if (!existsSync(dest)) {
        download(src, dest);
      }
    }
  }
  for (let alias in js) {
    if (js.hasOwnProperty(alias)) {
      let src = js[alias];
      let dest = `${dir}/js/${alias}.js`;
      if (!existsSync(dest)) {
        download(src, dest);
      }
    }
  }
};

const setup = () => {
  let vendorDir = `${distDir}/vendor`;
  let jsDir = `${vendorDir}/js`;
  let cssDir = `${vendorDir}/css`;

  [
    distDir,
    vendorDir,
    cssDir,
    jsDir,
  ].forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirp(dir);
    }
  });

  prepareResources(vendor, vendorDir);
};

setup();
