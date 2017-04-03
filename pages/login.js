/**
 * pages/login.js
 * @ndaidong
 **/

var start = (ctx) => {

  let data = {
    title: 'Login',
    message: 'Get into your dashboard'
  };

  let context = {
    css: [
      'vendor/css/mui.css',
      'css/style.css'
    ],
    js: {
      files: [
        'vendor/js/mui.js'
      ],
      entry: 'js/app.js'
    },
    SDATA: {
      username: 'alice'
    }
  };

  ctx.render('landing', data, context);
};

module.exports = start;
