// parseCSS

var fs = require('fs');

var debug = require('debug');
var info = debug('app:info');

var readFile = require('./readFile');
var compileCSS = require('./compileCSS');

var config = require('../../configs');
var {
  assetsDirs,
  distDir
} = config.settings;

var {
  ENV
} = config;


var distintCSS = (css) => {
  info(`Merging CSS from multi files...`);
  let externals = [];
  let internals = [];
  css.forEach((f) => {
    let arr = [f].concat(assetsDirs.map((dir) => {
      return `${dir}/${f}`;
    }));
    let s = '';
    for (let i = 0; i < arr.length; i++) {
      let ff = arr[i];
      s = readFile(ff);
      if (s) {
        if (f.includes('node_modules/')) {
          externals.push(s);
        } else {
          internals.push(s);
        }
        break;
      }
    }
    return s;
  });

  info(`Finish merging CSS files.`);
  return {
    externals,
    internals
  };
};

var parseCSS = (css = [], pathMD5 = '') => {

  info('Start parsing CSS...');

  let publicPath = `/css/${pathMD5}.css`;
  let fileToSave = `${distDir}${publicPath}`;

  if (ENV === 'production' && fs.existsSync(fileToSave)) {
    info(`Stop parsing CSS. Use already file ${fileToSave}`);
    return publicPath;
  }

  let {
    externals = [],
    internals = []
  } = distintCSS(css);

  let externalCSS = '';
  let internalCSS = '';

  if (externals.length) {
    externalCSS = externals.reduce((prev, curr) => {
      return prev.concat(curr);
    }, []).join('\n');
  }

  if (internals.length) {
    internalCSS = internals.reduce((prev, curr) => {
      return prev.concat(curr);
    }, []).join('\n');
  }

  compileCSS(internalCSS, externalCSS, fileToSave);

  return publicPath;
};

module.exports = parseCSS;
