/**
 * Testing
 * @ndaidong
 */

var test = require('tape');
var bella = require('bellajs');

var path = require('path');

var helpers = [
  'addExt',
  'compileCSS',
  'getAssetContent',
  'getHTTPStatus',
  'isVendorAsset',
  'minifyJS',
  'parseCSS',
  'parseJS',
  'parseLayout',
  'rollupJS',
  'transpileJS'
];

var isAsync = (fn) => {
  return fn.constructor.name === 'AsyncFunction';
};

test('Check if helpers are already', (assert) => {
  helpers.forEach((h) => {
    let f = require(path.join('../../../app/utils', h));
    assert.ok(bella.isFunction(f) || isAsync(f), `${h} must be a function`);
  });
  assert.end();
});
