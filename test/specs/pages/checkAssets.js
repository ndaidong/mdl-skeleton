/**
 * Testing
 * @ndaidong
 */

var addExt = require('../../../app/utils/addExt');
var getAssetContent = require('../../../app/utils/getAssetContent');

var checkAssets = (context = {}, assert) => {
  let {
    css,
    js
  } = context;

  css.forEach((file) => {
    let f = addExt(file, 'css');
    let c = getAssetContent(f);
    assert.ok(c !== '', `CSS file "${file}" must be already to use`);
  });

  let {
    files = [],
    entry = ''
  } = js;

  if (entry) {
    files.push(entry);
  }
  files.forEach((file) => {
    let f = addExt(file, 'js');
    let c = getAssetContent(f);
    assert.ok(c !== '', `JS file "${file}" must be already to use`);
  });
};

module.exports = checkAssets;
