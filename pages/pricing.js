/**
 * pages/pricing.js
 * @ndaidong
 **/

var start = (ctx) => {

  let n = ctx.session.views || 0;
  ctx.session.views = ++n;

  let data = {
    title: 'Pricing',
    message: 'How we estimate our value?',
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
      packages: {
        regular: '100$',
        silver: '200$',
        gold: '400$',
        preminium: '1000$'
      }
    }
  };

  ctx.render('landing', data, context);
};

module.exports = start;
