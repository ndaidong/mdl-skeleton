/**
 * scripts/builder
 * @ndaidong
 **/

var fs = require('fs');
var exec = require('child_process').execSync;

var mkdirp = require('mkdirp').sync;

var setup = (config) => {
  let {distDir} = config.settings;
  if (fs.existsSync(distDir)) {
    exec('rm -rf ' + distDir);
  }
  mkdirp(distDir);
  mkdirp(`${distDir}/css`);
  mkdirp(`${distDir}/js`);
  mkdirp(`${distDir}/images`);
  mkdirp(`${distDir}/fonts`);
};

module.exports = {
  setup
};
