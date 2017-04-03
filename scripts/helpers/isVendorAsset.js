// isVendorAsset

var config = require('../../configs');

var {
  distDir
} = config.settings;

var isVendorAsset = (file) => {
  return file.includes('node_modules/') || file.includes(`${distDir}/vendor`);
};

module.exports = isVendorAsset;
