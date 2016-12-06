var pkg = require('./../package.json');

var config = {
  ENV: 'dev'
};

config.name = pkg.name || '';
config.version = pkg.version || '';
config.description = pkg.description || '';
config.keywords = pkg.keywords || '';
config.author = pkg.author || '';

config.baseDir = '/';

config.meta = {
  name: 'mdl-skeleton',
  alias: '',
  slogan: '',
  description: '',
  keywords: '',
  image: '',
  author: '',
  title: 'Material Design Lite',
  domain: '',
  url: '',
  canonical: ''
};

config.port = 9999;

config.settings = {
  dateformat: 'D, M d, Y h:i:s O',
  viewDir: './app/views/',
  tplFileExtension: '.html'
};

config.staticData = {
  maxAge: 24 * 60 * 6e4,
  etag: true,
  lastModified: true
};

config.csp = {
  directives: {
    defaultSrc: [
      `'self'`
    ],
    scriptSrc: [
      `'self'`,
      `'unsafe-inline'`,
      `'unsafe-eval'`,
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com'
    ],
    styleSrc: [
      `'self'`,
      `'unsafe-inline'`,
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com'
    ],
    fontSrc: [
      `'self'`,
      `'unsafe-inline'`,
      `data:`,
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com'
    ],
    imgSrc: [
      `'self'`,
      `data:`,
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com'
    ],
    frameSrc: [
      `'self'`
    ],
    connectSrc: [
      `'self'`
    ],
    sandbox: [
      'allow-forms',
      'allow-scripts',
      'allow-popups',
      'allow-same-origin',
      'allow-top-navigation'
    ],
    objectSrc: [
      `'none'`
    ],
    reportUri: '/report-violation'
  },
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: false,
  safari5: false,
  loose: true
};

config.hsts = {
  maxAge: 10886400000,
  includeSubDomains: true,
  force: true
};

module.exports = config;
