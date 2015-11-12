/**
 * Starting app
 * @ndaidong
**/
'use strict'; // enable strict mode to use "let" in node.js 4.x

var traceur = require('traceur');
traceur.require.makeDefault((filename) => {
  return !filename.includes('node_modules');
});

var fs = require('fs');
var path = require('path');

var bella = require('bellajs');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var robots = require('robots.txt');
var helmet = require('helmet');
var morgan = require('morgan');
var DeviceDetector = require('device-detector');
var compiler = require('./app/workers/compiler');

var app = express();

var config = require('./configs/base');
var envFile = './configs/env/vars';
if(fs.existsSync(envFile + '.js')){
  let configEnv = require(envFile);
  let configAll = bella.copies(configEnv, config);
  config = configAll;
}

config.revision = bella.id;

app.set('config', config);
app.set('port', config.port);
app.set('etag', 'strong');

app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy({setTo: config.meta.name}));

app.use(robots(path.join(__dirname, '/robots.txt')));
app.use(favicon(path.join(__dirname, '/assets/images') + '/brand/favicon.ico'));

var staticOpt = {
  maxAge: 24 * 60 * 6e4,
  etag: true,
  lastModified: true
}

app.use(express.static(path.join(__dirname, 'assets'), staticOpt));
app.use(express.static(path.join(__dirname, 'dist'), staticOpt));

app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));
app.use(cookieParser());

app.use((req, res, next) => {
  res.render404 = () => {
    let s = fs.readFileSync('./app/views/errors/404.html', 'utf8');
    res.status(404).send(s);
  }
  res.render500 = () => {
    let s = fs.readFileSync('./app/views/errors/500.html', 'utf8');
    res.status(500).send(s);
  }
  next();
});

app.use(compiler.io);

morgan.token('navigator', (req) => {
  let ua = req.headers['user-agent'];
  let d = DeviceDetector.parse(ua);
  if(d && bella.isObject(d)){
    if(d.type === 'Bot'){
      return bella.trim(d.engine + ' ' + d.version);
    }
    return bella.trim(d.browser + ' ' + d.version) + ', ' + bella.trim(d.os + ' ' + d.type);
  }
  return 'Unknown device';
});
morgan.token('user', (req, res) => {
  let u = res.user;
  if(u && bella.isObject(u)){
    return u.name;
  }
  return 'Guest';
});
morgan.token('path', (req) => {
  return req.path;
});

app.use(morgan(':method :path :status - :res[content-length] bytes :response-time ms - :user, :navigator - [:date[web]]'));

fs.readdirSync('./app/routers').forEach((file) => {
  if(path.extname(file) === '.js'){
    require('./app/routers/' + file)(app);
  }
});

app.use((req, res) => {
  return res.render404();
});

app.use((error, req, res) => {
  return res.render500();
});

var onServerReady = () => {
  require('./app/workers/builder').setup();

  console.log('Server started at the port %d in %s mode', config.port, config.ENV);
  console.log('http://127.0.0.1:' + config.port);
  console.log(config.meta.url);
}

app.listen(config.port, onServerReady);
