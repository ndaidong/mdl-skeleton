// getAssetContent

var readFile = require('./readFile');

var config = require('../../configs');
var {
  distDir,
  assetsDirs
} = config.settings;

var getAssetContent = (f) => {

  let arr = [
    f,
    `${distDir}/${f}`,
    `${distDir}/vendor/${f}`,
    `${distDir}/vendor/css/${f}`,
    `${distDir}/vendor/js/${f}`
  ].concat(assetsDirs.map((dir) => {
    return `${dir}/${f}`;
  }));

  let s = '';
  for (let i = 0; i < arr.length; i++) {
    let file = arr[i];
    s = readFile(file);
    if (s) {
      break;
    }
  }
  return s;
};

module.exports = getAssetContent;
