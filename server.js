/**
 * Starting app
 * @ndaidong
 **/

const fs = require('fs');
const path = require('path');

const bella = require('bellajs');

var compiler = require('./app/workers/compiler');

var config = require('./configs/base');
var envFile = './configs/env/vars';
if (fs.existsSync(envFile + '.js')) {
  let configEnv = require(envFile);
  let configAll = bella.copies(configEnv, config);
  config = configAll;
}

config.revision = bella.id;

const debug = require('debug');
const info = debug('app:info');
const error = debug('app:error');

const Koa = require('koa');
const router = require('koa-router')();
const favicon = require('koa-favicon');
const assets = require('koa-static');
const bodyParser = require('koa-bodyparser');

const app = module.exports = new Koa();

app.use(favicon(path.join(__dirname, '/assets/images') + '/brand/favicon.ico'));

app.use(assets(path.join(__dirname, 'assets'), config.staticData));
app.use(assets(path.join(__dirname, 'dist'), config.staticData));

app.use(bodyParser({
  encode: 'utf-8',
  formLimit: '128kb',
  jsonLimit: '1mb',
  onerror: (err, ctx) => {
    ctx.throw('body parse error', 422);
    error(err);
  }
}));

app.use(compiler.io);

fs.readdirSync('./app/routers').forEach((file) => {
  if (path.extname(file) === '.js') {
    require('./app/routers/' + file)(router);
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err, ctx) => {
  error('server error', err, ctx);
});

var onServerReady = () => {
  info(`Server started at the port ${config.port} in ${config.ENV} mode`);
  info('Access website via', `http://127.0.0.1:${config.port}`);
  info('Public URL:', config.meta.url || 'None');
};

app.listen(config.port, onServerReady);
