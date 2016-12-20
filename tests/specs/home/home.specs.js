/**
 * Testing
 * @ndaidong
 */

var test = require('tape');
var bella = require('bellajs');
var request = require('supertest');

var app = require('../../../server');
var config = app.context.config;
var target = `http://localhost:${config.port}`;

test('Check app config', (assert) => {
  assert.ok(bella.isObject(config), 'App config must be an object');
  assert.ok(bella.hasProperty(config, 'name'), 'Config must have name');
  assert.ok(bella.hasProperty(config, 'version'), 'Config must have version');
  assert.ok(bella.hasProperty(config, 'ENV'), 'Config must have ENV');
  assert.ok(bella.hasProperty(config, 'port'), 'Config must have port');
  assert.ok(bella.hasProperty(config, 'revision'), 'Config must have revision');
  assert.ok(bella.isObject(config.staticData), 'config.staticData must be an object');
  assert.end();
});

test('Check default page', (assert) => {
  request(target)
    .get('/')
    .expect((res) => {
      assert.ok(bella.hasProperty(res, 'status'), 'Response must have status');
      assert.ok(bella.hasProperty(res, 'text'), 'Response must have text');
      assert.ok(res.status === 200, 'Status must be 200');
      let txt = bella.stripTags(res.text);
      assert.ok(txt.length > 100, 'Text must be not empty');
    }).end(assert.end);
});


