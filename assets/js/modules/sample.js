/**
 * sample module
 * @ndaidong
**/

'use strict';

(() => {

  var __ModuleName__ = 'Sample';
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
    } else if (root.exports) {
      root.exports[__ModuleName__] = M;
    } else {
      root[__ModuleName__] = M;
    }
  }
})();
