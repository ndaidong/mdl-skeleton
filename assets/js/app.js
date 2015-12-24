/**
 * start.js
 * Init app
 * @ndaidong
*/
(function init(sdata) {

  var App = window.App = {};

  var _sdata = sdata;
  var _store = {};

  App.set = function _set(key, value) {
    _store[key] = value;
  };

  App.get = function _get(key) {
    return _store[key];
  };

  App.remove = function _remove(key) {
    if (Bella.hasProperty(_store, key)) {
      _store[key] = null;
      delete _store[key];
    }
  };

  App.sdata = function _sd(d) {
    if (d) {
      _sdata = d;
    }
    return _sdata;
  };

  App.me = function _me() {
    return _sdata.user || false;
  };

})(window.SDATA);
