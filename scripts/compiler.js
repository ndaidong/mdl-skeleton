/**
 * scripts/compiler
 * @ndaidong
 **/

var debug = require('debug');
var info = debug('app:info');
var error = debug('app:error');

var bella = require('bellajs');
var lru = require('lru-cache');
var pageCache = lru({
  max: 50,
  maxAge: 15 * 6e4
});

var config = require('../configs');
var {settings: siteSettings, ENV} = config;

var {
  readFile,
  getHTTPStatus,
  parseLayout
} = require('./helpers');

var compile = (input) => {
  return new Promise((resolve, reject) => {
    info('Start compiling...');
    try {

      let {
        pageId
      } = input.context;

      if (ENV === 'production') {
        let cache = pageCache.get(pageId);
        if (cache) {
          info('Finish compiling with cached data');
          return resolve({
            status: 200,
            body: cache,
            input
          });
        }
      }

      let output = parseLayout(input, pageId);
      if (ENV === 'production') {
        info('Saving data to cache');
        pageCache.set(pageId, output);
      }

      info('Compiling finished');
      return resolve({
        status: 200,
        body: output,
        input
      });
    } catch (err) {
      return reject(err);
    }
  });
};

var renderError = (errorCode = 500, message = '') => {
  let {viewDir} = siteSettings;
  let html = readFile(`${viewDir}error.html`);
  let serverStatus = getHTTPStatus(errorCode);
  let body = bella.template(html).compile({
    title: `${errorCode} ${serverStatus}`,
    errorCode,
    message: message || serverStatus
  });
  return body;
};

var render = (layout, data, context) => {
  if (bella.isNumber(layout)) {
    let body = renderError(layout);
    return {status: layout, body};
  }
  return compile({layout, data, context}).then((output) => {
    return output;
  }).catch((err) => {
    error(err);
    let body = renderError(500, 'Sorry, something went wrong!');
    return {status: 500, body};
  });
};

module.exports = async function _toRender(layout, data, context = {}) {
  let ctx = this; // eslint-disable-line
  context.pageId = bella.md5(ctx.originalUrl);
  let output = await render(layout, data, context);
  ctx.status = output.status;
  ctx.body = output.body;
};
