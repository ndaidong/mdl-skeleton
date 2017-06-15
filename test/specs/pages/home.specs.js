/**
 * Testing
 * @ndaidong
 */

var test = require('tape');
var bella = require('bellajs');

var home = require('../../../app/pages/home');

var checkCtxRender = require('./checkCtxRender');
var checkAssets = require('./checkAssets');

test('Check home page', (assert) => {
  assert.ok(bella.isFunction(home), 'home page must be a function');

  let {
    layout,
    data,
    context
  } = checkCtxRender(home, assert);

  assert.ok(layout === 'landing', 'layout for home page must be "landing"');
  assert.ok(data.title === 'Welcome', 'page title must be "Welcome"');
  assert.ok(bella.isObject(context), 'page context must be object');

  checkAssets(context, assert);

  assert.end();
});
