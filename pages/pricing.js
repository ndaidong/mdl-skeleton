/**
 * pages/pricing.js
 * @ndaidong
 **/

var start = (ctx) => {

  let data = {
    title: 'Pricing',
    message: 'How we estimate our value?'
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
