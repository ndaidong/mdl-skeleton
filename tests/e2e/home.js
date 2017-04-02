/**
 * Sample E2E test script with TestCafe
 * For more info, please visit:
 * --> https://devexpress.github.io/testcafe/documentation/getting-started/
 *
**/

/* global fixture test */

var assert = require('assert');
var selector = require('testcafe').Selector;

fixture('Homepage').page('http://127.0.0.1:8081');

const getTitle = selector(() => document.getElementsByTagName('title'));

const SITE_TITLE = 'Welcome - Site name';

test(`It must have title "${SITE_TITLE}"`, async () => {
  let title = await getTitle();
  assert.ok(title.textContent === SITE_TITLE);
});
