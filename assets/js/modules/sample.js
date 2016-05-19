/**
 * sample module
 * @ndaidong
**/

'use strict';

((name, factory) => {
  var ENV = typeof module !== 'undefined' && module.exports ? 'node' : 'browser';
  if (ENV === 'node') {
    module.exports = factory();
  } else {
    var root = window || {};
    if (root.define && root.define.amd) {
      root.define([], factory);
    } else if (root.exports) {
      root.exports = factory();
    } else {
      root[name] = factory();
    }
  }
})('Sample', () => { // eslint-disable-line no-invalid-this

  var _data = {};

  var M = {
    set: (key, val) => {
      _data[key] = val;
    },
    get: (key) => {
      return _data[key] || null;
    }
  };

  return M;
});
