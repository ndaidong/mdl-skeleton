/**
 * pages/login.js
 * @ndaidong
 **/

var start = (ctx) => {

  let n = ctx.session.views || 0;
  ctx.session.views = ++n;

  let data = {
    title: 'Login',
    message: 'Get into your dashboard',
    views: n
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
      clientId: 'abcdxyz',
      clientKey: '123456789'
    }
  };

  ctx.render('landing', data, context);
};

module.exports = start;
