/**
 * HomeController
 **/

var start = (ctx) => {
  let data = {
    meta: {
      title: 'MDL skeleton'
    },
    title: 'Name & Title'
  };

  let context = {
    css: [
      'vendor/mdl',
      'styles'
    ],
    js: [
      'vendor/material',
      'vendor/bella',
      'vendor/doc',
      'modules/es6.test',
      'modules/sample',
      'app'
    ],
    sdata: {
      user: {
        name: 'tester',
        id: 1000
      }
    }
  };
  ctx.render('landing', data, context);
};

module.exports = start;
