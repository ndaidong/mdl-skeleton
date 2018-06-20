/**
 * Testing
 * @ndaidong
 */

const test = require('tap').test;
const request = require('supertest');

const {load} = require('cheerio');

const {
  hasProperty,
  isObject,
  stripTags,
} = require('bellajs');

const config = require('../../src/configs');

const siteData = require('../../src/configs/site.conf.json');

const {
  url,
} = config;

require('../../server');

test('Check app config', (assert) => {
  assert.ok(isObject(config), 'App config must be an object');
  assert.ok(hasProperty(config, 'name'), 'Config must have name');
  assert.ok(hasProperty(config, 'version'), 'Config must have version');
  assert.end();
});

test('Check home page', (assert) => {
  request(url)
    .get('/')
    .expect((res) => {
      assert.ok(hasProperty(res, 'status'), 'Response must have status');
      assert.ok(hasProperty(res, 'text'), 'Response must have text');

      let {
        status,
        text,
      } = res;

      assert.ok(status === 200, 'Status must be 200');
      let txt = stripTags(text);
      assert.ok(txt.length > 10, 'Text must be not empty');

      let {meta} = siteData;

      let $ = load(text);
      let title = $('title').text();

      assert.ok(title === meta.title, `Page title must be "${meta.title}"`);
      assert.end();
    }).end(() => {
      setTimeout(process.exit, 2000);
    });
});
