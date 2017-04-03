/**
 * Starting app
 * @ndaidong
 **/

const fs = require('fs');
const path = require('path');
const pjoin = path.join;

const bella = require('bellajs');
const debug = require('debug');
const error = debug('app:error');

const Koa = require('koa');
const helmet = require('koa-helmet');
const router = require('koa-router')();
const favicon = require('koa-favicon');
const kstatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const responseTime = require('koa-response-time');
const session = require('koa-session');

var config = require('./configs');
config.revision = bella.id;

var {builder, compiler, sesStore} = require('./scripts');

const app = new Koa();

app.context.config = config;

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
app.use(favicon(pjoin(__dirname, '/assets/seo/favicon.ico')));
app.use(kstatic(pjoin(__dirname, '/assets/seo/robots.txt')));

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

app.use(kstatic(pjoin(__dirname, 'assets'), staticData));
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

fs.readdirSync('./routers').forEach((file) => {
  if (path.extname(file) === '.js') {
    require('./routers/' + file)(router);
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
