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
  title: '',
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

module.exports = config;
