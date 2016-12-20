/**
 * Default router
**/

const homeController = require('../controllers/home');

module.exports = (router) => {
  router.get('/', homeController);
};
