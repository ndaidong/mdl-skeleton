/**
 * sample module
 * @ndaidong
**/

'use strict';

(() => {

  var ENV = typeof module !== 'undefined' && module.exports ? 'node' : 'browser';

  var _data = {};

  var M = {
    set: (key, val) => {
      _data[key] = val;
    },
    get: (key) => {
      return _data[key] || null;
    }
  };

  // exports
  if (ENV === 'node') {
    module.exports = M;
  } else {
    let root = window || {};
    if (root.define && root.define.amd) {
      root.define(() => {
        return M;
      });
    }
    root.Sample = M;
  }
})();
