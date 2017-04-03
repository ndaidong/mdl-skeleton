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
