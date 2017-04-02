/**
 * configs/index
 * @ndaidong
 **/

var debug = require('debug');
var error = debug('app:error');

var pkg = require('./../package.json');

var meta = require('./meta');
var settings = require('./settings');

var env = process.env || {}; // eslint-disable-line no-process-env

[
  'NODE_ENV',
  'APP_HOST',
  'APP_PORT'
].forEach((name) => {
  if (!env[name]) {
    error(`Environment variable ${name} is missing, use default instead.`);
  }
});

var config = {
  ENV: env.NODE_ENV || 'development'
};

config.name = pkg.name || '';
config.version = pkg.version || '';

config.baseDir = env.BASE_DIR || '/';

config.host = env.APP_HOST || 'http://127.0.0.1';
config.port = env.APP_PORT || '8081';

config.settings = settings;
config.meta = meta;

module.exports = config;
