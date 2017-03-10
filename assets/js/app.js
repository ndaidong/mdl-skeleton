/**
 * start.js
 * Init app
 * @ndaidong
 */

/* global Bella */

((sdata) => {

  var App = {};

  var _sdata = sdata;
  var _store = {};

  App.set = (key, value) => {
    _store[key] = value;
  };

  App.get = (key) => {
    return _store[key];
  };

  App.remove = (key) => {
    if (Bella.hasProperty(_store, key)) {
      _store[key] = null;
      delete _store[key];
    }
  };

  App.sdata = (d) => {
    if (d) {
      _sdata = d;
    }
    return _sdata;
  };

  App.me = () => {
    return _sdata.user || false;
  };

  window.App = App;

  /* global doc Sample */
  doc.ready(() => {
    console.log('DOM ready.');
    Sample.set('k', 19999);
    console.log(Sample.get('k')); // eslint-disable-line
  });

})(window.SDATA);
