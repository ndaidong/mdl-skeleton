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
      'muicss/dist/css/mui.min.css',
      'css/style.css'
    ],
    js: {
      files: [
        'muicss/dist/js/mui.min.js'
      ],
      entry: 'js/app.js'
    }
  };

  ctx.render('landing', data, context);
};

module.exports = start;
