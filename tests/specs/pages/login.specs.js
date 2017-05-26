/**
 * Testing
 * @ndaidong
 */

var test = require('tape');
var bella = require('bellajs');

var login = require('../../../app/pages/login');

var checkCtxRender = require('./checkCtxRender');
var checkAssets = require('./checkAssets');

test('Check login page', (assert) => {
  assert.ok(bella.isFunction(login), 'login page must be a function');

  let {
    layout,
    data,
    context
  } = checkCtxRender(login, assert);

  assert.ok(layout === 'landing', 'layout for login page must be "landing"');
  assert.ok(data.title === 'Login', 'page title must be "Login"');
  assert.ok(bella.isObject(context), 'page context must be object');

  checkAssets(context, assert);

  assert.end();
});
