/**
 * pages/home.js
 * @ndaidong
 **/

var start = (ctx) => {

  let data = {
    title: 'Welcome',
    message: 'Why we do what we do?'
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
      loginStatus: false,
      timestamp: Date.now()
    }
  };

  ctx.render('landing', data, context);
};

module.exports = start;
