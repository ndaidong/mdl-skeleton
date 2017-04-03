/**
 * pages/about.js
 * @ndaidong
 **/

var start = (ctx) => {

  let data = {
    title: 'About us',
    message: 'Who we are and what we do?'
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
      username: 'mdl-skeleton',
      email: 'developer@mdl.com'
    }
  };

  ctx.render('landing', data, context);
};

module.exports = start;
