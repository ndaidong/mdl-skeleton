/**
 * App config
 * @ndaidong
 **/

var base = require('./base');
var csp = require('./csp');
var hsts = require('./hsts');
var hpkp = require('./hpkp');

var {
  parseHSTS,
  parseHPKP,
  parseCSP
} = require('./../../scripts/workers/headerParser');


var h = Object.assign(base, parseHSTS(hsts), parseHPKP(hpkp), parseCSP(csp));

module.exports = h;
