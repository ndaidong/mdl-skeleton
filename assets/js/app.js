/**
 * start.js
 * Init app
 * @ndaidong
*/
;(function(sdata){

  var App = window.App = {};

  var _sdata = sdata;
  var _store = {};

  App.set = function(key, value){
    _store[key] = value;
  }
  App.get = function(key){
    return _store[key];
  }
  App.remove = function(key){
    if(Bella.hasProperty(_store, key)){
      _store[key] = null;
      delete _store[key];
    }
  }
  App.sdata = function(d){
    if(d){
      _sdata = d;
    }
    return _sdata;
  }
  App.me = function(){
    return _sdata.user || false;
  }

})(window.SDATA);
