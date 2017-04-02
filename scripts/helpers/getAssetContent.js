// getAssetContent

var readFile = require('./readFile');

var config = require('../../configs');
var {assetsDirs} = config.settings;

var getAssetContent = (file) => {
  let arr = [file].concat(assetsDirs.map((dir) => {
    return `${dir}/${file}`;
  }));

  let s = '';
  for (let i = 0; i < arr.length; i++) {
    let f = arr[i];
    s = readFile(f);
    if (s) {
      break;
    }
  }
  return s;
};

module.exports = getAssetContent;
