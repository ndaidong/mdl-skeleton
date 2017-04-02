// compileCSS

var debug = require('debug');
var info = debug('app:info');
var error = debug('app:error');

var postcss = require('postcss');
var postcssFilter = require('postcss-filter-plugins');
var nested = require('postcss-nested');
var cssnano = require('cssnano');
var cssnext = require('postcss-cssnext');
var mqpacker = require('css-mqpacker');

var writeFile = require('./writeFile');

var {
  ENV
} = require('../../configs');

const POSTCSS_PLUGINS = [
  postcssFilter({
    silent: true
  }),
  nested(),
  cssnext(),
  mqpacker({
    sort: true
  })
];

var postProcess = async (css) => {
  info('PostCSS started...');
  let plugins = POSTCSS_PLUGINS.slice(0);
  if (ENV === 'production') {
    plugins.push(cssnano());
  }
  try {
    let result = await postcss(plugins).process(css);
    info('PostCSS done.');
    return result.css;
  } catch (err) {
    error('PostCSS process failed.');
    error(err);
    return err;
  }
};

var compile = async (custom, otherSouce = '', output) => {
  info('Start compiling CSS...');
  try {
    let css = await postProcess(custom);
    writeFile(output, otherSouce + '\n' + css);
    info('Finish compiling CSS.');
  } catch (err) {
    error('Error while compiling CSS.');
    error(err);
  }
};

module.exports = compile;
