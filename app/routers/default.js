/**
 * Default router
**/

const homeController = require('../pages/home');

module.exports = (router) => {
  router.get('/', homeController);
};
