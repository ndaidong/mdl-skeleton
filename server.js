// server.js

const ssre = require('ssr-engine');

const {
  info,
} = require('./src/utils/logger');

const config = require('./src/configs');
config.baseDir = __dirname;

ssre.configure(config);

let app = ssre.start();
let appConfig = app.get('config');
let {
  ENV,
  url,
  port,
} = appConfig;

info(`Server started at the port ${port} in ${ENV} mode`);
info('Access website via', `${url}`);
