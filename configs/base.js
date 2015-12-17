var pkg = require('./../package.json');

var config = {
  ENV: 'dev'
}

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
}

config.port = 9999;

config.settings = {
  dateformat: 'D, M d, Y h:i:s O',
  memberOnlyRedirect: '/',
  guestOnlyRedirect: '/',
  defaultUserAvatar: '/images/icons/no-avatar.gif',
  ticketDir: './storage/tickets/',
  cacheDir: './storage/cache/',
  viewDir: './app/views/',
  tplFileExtension: '.html'
}

/*eslint-disable */
config.csp = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", '*.googleapis.com', '*.gstatic.com', '*.google-analytics.com'],
  styleSrc: ["'self'", "'unsafe-inline'", '*.googleapis.com', '*.gstatic.com', '*.google-analytics.com'],
  fontSrc: ["'self'", "'unsafe-inline'", 'data:', '*.googleapis.com', '*.gstatic.com', '*.google-analytics.com'],
  imgSrc: ["'self'", 'data:', '*', '*.googleapis.com', '*.gstatic.com', '*.google-analytics.com'],
  frameSrc: ["'self'"],
  connectSrc: ["'self'"],
  sandbox: ['allow-forms', 'allow-scripts', 'allow-popups', 'allow-same-origin', 'allow-top-navigation'],
  reportUri: '/report-violation',
  objectSrc: [],
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: false,
  safari5: false
}

config.hsts = {
  maxAge: 10886400000,
  includeSubDomains: true,
  force: true
}
/*eslint-enable */

module.exports = config;
