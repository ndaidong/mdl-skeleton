/**
 * For parsing response header
 * @ndaidong
 **/


const bella = require('bellajs');

const DEFAULT_MAX_AGE = 180 * 24 * 60 * 60;

var parseHSTS = (opts = {}) => {

  let {
    maxAge = DEFAULT_MAX_AGE,
    includeSubDomains,
    includeSubdomains,
    preload = false
  } = opts;

  let withSubDomains = includeSubDomains || includeSubdomains || false;

  let arr = ['max-age=' + Math.round(maxAge)];
  if (withSubDomains) {
    arr.push('includeSubDomains');
  }
  if (preload) {
    arr.push('preload');
  }

  let key = 'Strict-Transport-Security';
  let value = arr.join('; ') + ';';

  let output = {};
  Object.defineProperty(output, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  });

  return output;
};

var parseHPKP = (opts = {}) => {

  let {
    maxAge = DEFAULT_MAX_AGE,
    sha256s = [],
    includeSubDomains,
    includeSubdomains,
    reportOnly = false,
    reportUri
  } = opts;

  let withSubDomains = includeSubDomains || includeSubdomains || false;

  let arr = sha256s.map((sha) => {
    return `pin-sha256="${sha}"`;
  });

  arr.push('max-age=' + Math.round(maxAge));

  if (withSubDomains) {
    arr.push('includeSubDomains');
  }
  if (reportUri) {
    arr.push(`report-uri="${reportUri}"`);
  }

  let key = reportOnly ? 'Public-Key-Pins-Report-Only' : 'Public-Key-Pins';
  let value = arr.join('; ') + ';';

  let output = {};
  Object.defineProperty(output, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  });

  return output;
};

var parseCSP = (opts = {}) => {
  let {
    reportOnly = false,
    reportUri,
    directives
  } = opts;

  let arr = [];
  for (let k in directives) {
    if (bella.hasProperty(directives, k)) {
      let item = directives[k];
      if (bella.isArray(item)) {
        let v = item.join(' ');
        arr.push(`${k}: ${v}`);
      }
    }
  }

  if (reportOnly) {
    arr.push(`report-uri ${reportUri}`);
  }

  let key = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
  let value = arr.join('; ') + ';';

  let output = {};
  Object.defineProperty(output, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  });

  return output;
};

module.exports = {
  parseHSTS,
  parseHPKP,
  parseCSP
};
