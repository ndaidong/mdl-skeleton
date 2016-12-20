var debug = require('debug');
var error = debug('app:error');

var pkg = require('./../package.json');

var meta = require('./meta');
var settings = require('./settings');
var staticData = require('./static');

var headers = require('./headers');

var env = process.env || {}; // eslint-disable-line no-process-env

[
  'NODE_ENV',
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
config.description = pkg.description || '';
config.keywords = pkg.keywords || '';
config.author = pkg.author || '';

config.baseDir = env.BASE_DIR || '/';

config.port = env.APP_PORT || '9999';

config.settings = settings;

config.staticData = staticData;

config.meta = meta;

config.headers = headers;

module.exports = config;
