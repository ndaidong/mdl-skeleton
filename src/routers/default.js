// Default router

const home = require('../pages/home');
const api = require('../pages/api');

module.exports = (app) => {
  app.get('/', home.start);
  app.get('/json', api.json);
};
