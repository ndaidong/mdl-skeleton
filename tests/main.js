/* global fixture test */

var assert = require('assert');
var selector = require('testcafe').Selector;

fixture('Homepage').page('http://127.0.0.1:9999');

const getTitle = selector(() => document.getElementsByTagName('title'));

test('It must have title "MDL skeleton"', async () => {
  let title = await getTitle();
  assert.ok(title.textContent === 'MDL skeleton');
});
