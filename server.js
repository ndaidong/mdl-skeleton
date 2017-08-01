/**
 * Starting app
 * @ndaidong
 **/

/* eslint-disable no-console */

var fs = require('fs');
var path = require('path');
var pjoin = path.join;

var bella = require('bellajs');
var debug = require('debug');
var error = debug('app:error');

var Koa = require('koa');
var helmet = require('koa-helmet');
var router = require('koa-router')();
var favicon = require('koa-favicon');
var kstatic = require('koa-static');
var bodyParser = require('koa-bodyparser');
var responseTime = require('koa-response-time');
var session = require('koa-session');

var config = require('./configs');
config.revision = bella.createId();

var {builder, compiler, sesStore} = require('./scripts');

var app = new Koa();

app.context.config = config;

console.log(config);

// session
const APP_KEY = bella.md5(config.name);
const SESSION_MAX_AGE = 6e4 * 60 * 24 * 7; // 7 days
const SESSION_KEY = 'MDLID';

app.keys = [APP_KEY];

var sesConfig = {
  key: SESSION_KEY,
  maxAge: SESSION_MAX_AGE,
  overwrite: true,
  httpOnly: true,
  signed: true,
  store: sesStore
};

app.use(session(sesConfig, app));

// headers
app.use(helmet());
app.use(responseTime());

// static resources
app.use(favicon(pjoin(__dirname, '/app/assets/seo/favicon.ico')));
app.use(kstatic(pjoin(__dirname, '/app/assets/seo/robots.txt')));

var {
  ENV,
  host: HOST,
  port: PORT,
  meta: META
} = config;

var staticData = {
  cacheControl: false,
  etag: false
};

if (ENV === 'production') {
  staticData = {
    etag: true,
    maxAge: 24 * 60 * 6e4,
    cacheControl: true,
    lastModified: true
  };
}

app.use(kstatic(pjoin(__dirname, 'app/assets'), staticData));
app.use(kstatic(pjoin(__dirname, 'dist'), staticData));

app.use(bodyParser({
  encode: 'utf-8',
  formLimit: '128kb',
  jsonLimit: '1mb',
  onerror: (err, ctx) => {
    ctx.throw('body parse error', 422);
    error(err);
  }
}));

app.context.render = compiler;

fs.readdirSync('./app/routers').forEach((file) => {
  if (path.extname(file) === '.js') {
    require('./app/routers/' + file)(router);
  }
});

app.use(router.routes()).use(router.allowedMethods({throw: true}));

app.use((ctx) => {
  ctx.render(404);
});

app.use((err, ctx) => {
  error(err);
  ctx.render(500);
});

var onServerReady = () => {
  builder.setup(config);
  console.log(`Server started at the port ${PORT} in ${ENV} mode`);
  console.log('Access website via', `${HOST}:${PORT}`);
  console.log(`Public URL: ${META.url || 'None'}`);
};

app.listen(PORT, onServerReady);

module.exports = app;
