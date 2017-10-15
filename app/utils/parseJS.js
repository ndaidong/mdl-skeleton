// parseJS

var fs = require('fs');
var path = require('path');

const {
  name
} = require('../../package.json');

const debug = require('debug');
const info = debug(`${name}:info`);

var writeFile = require('./writeFile');
var readFile = require('./readFile');

var rollupJS = require('./rollupJS');
var transpileJS = require('./transpileJS');
var minifyJS = require('./minifyJS');

var isVendorAsset = require('./isVendorAsset');

var config = require('../../configs');
var {
  assetsDirs,
  distDir
} = config.settings;

var {
  ENV
} = config;

var compileMultiJS = (js) => {
  info(`Merging JS from multi files...`);
  let allJS = js.map((f) => {

    let part = path.parse(f);
    if (!part.ext) {
      f += '.js';
    }

    let arr = [
      f,
      `${distDir}/${f}`,
      `${distDir}/js/${f}`,
      `${distDir}/vendor/${f}`,
      `${distDir}/vendor/js/${f}`
    ].concat(assetsDirs.map((dir) => {
      return `${dir}/${f}`;
    })).concat(assetsDirs.map((dir) => {
      return `${dir}/js/${f}`;
    }));

    let s = '';
    for (let i = 0; i < arr.length; i++) {
      let ff = arr[i];
      s = readFile(ff);
      if (s) {
        if (!isVendorAsset(ff)) {
          s = transpileJS(s);
        }
        break;
      }
    }
    return s;
  }).reduce((prev, curr) => {
    return prev.concat(curr);
  }, []).join('\n');

  info(`Finish merging JS files.`);
  return ENV === 'production' ? minifyJS(allJS) : allJS;
};

var parseJS = (js, pathMD5 = '') => {

  info('Start parsing JS...');

  let {
    entry = '',
    files = []
  } = js;

  let publicPath = `/js/${pathMD5}.js`;
  let fileToSave = `${distDir}${publicPath}`;

  if (ENV === 'production' && fs.existsSync(fileToSave)) {
    info(`JS parsing done. Use already created file ${fileToSave}`);
    return publicPath;
  }

  let code = '';
  if (files.length > 0) {
    let allJS = compileMultiJS(files);
    code = ENV === 'production' ? minifyJS(allJS) : allJS;
  }

  if (entry) {
    return rollupJS(entry, code, pathMD5);
  }

  info('Finish parsing JS sources. Write to file.');
  writeFile(fileToSave, code);

  return publicPath;
};

module.exports = parseJS;
