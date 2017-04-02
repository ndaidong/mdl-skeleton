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
