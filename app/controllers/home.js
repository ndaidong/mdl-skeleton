/**
 * HomeController
 **/

export var start = (req, res) => {

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
      'vendor/fetch',
      'vendor/promise',
      'app',
      'modules/es6.test'
    ]
  };

  return res.render('landing', data, context);
};
