/**
 * scripts/helpers
 * @ndaidong
 **/

var getHTTPStatus = require('./getHTTPStatus');

var readFile = require('./readFile');
var writeFile = require('./writeFile');
var delFile = require('./delFile');

var parseLayout = require('./parseLayout');
var parseCSS = require('./parseCSS');
var parseJS = require('./parseJS');

module.exports = {
  getHTTPStatus,
  readFile,
  writeFile,
  delFile,
  parseLayout,
  parseCSS,
  parseJS
};
