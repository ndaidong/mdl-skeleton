/**
 * pages/home.js
 * @ndaidong
 **/

var start = (ctx) => {

  let n = ctx.session.views || 0;
  ctx.session.views = ++n;

  let data = {
    title: 'Welcome',
    message: 'Why we do what we do?',
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
      views: n,
      loginStatus: false,
      timestamp: Date.now()
    }
  };

  ctx.render('landing', data, context);
};

module.exports = start;
