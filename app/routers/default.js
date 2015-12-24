/**
 * Default router
**/

var homeController = require('../controllers/home');

module.exports = (app) => {
  app.get('/', homeController.start);
};
