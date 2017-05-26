/**
 * routers/default
 * @ndaidong
 **/

var home = require('../pages/home');
var about = require('../pages/about');
var pricing = require('../pages/pricing');
var login = require('../pages/login');

module.exports = (router) => {
  router.get('/', home);
  router.get('/about', about);
  router.get('/pricing', pricing);
  router.get('/login', login);
};
