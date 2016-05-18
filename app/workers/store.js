/**
 * Store module for caching data in app life circle
 * Using memory cache and file-based cache
 * @ndaidong
*/

/* eslint guard-for-in: 0*/
/* eslint no-console: 0*/

var fs = require('fs');
var bella = require('bellajs');

var store = {}, ttl = 15 * 6e4;

var cacher = {
  set: (key, val, lifeTime = 0) => {
    store[key] = {
      value: val,
      expires: bella.time() + (lifeTime > 0 ? lifeTime : ttl)
    };
    return cacher;
  },
  get: (key) => {
    let d = store[key] || null;
    if (!d) {
      return null;
    }
    let t = d.time, now = bella.time();
    if (now > t) {
      store[key] = null;
      delete store[key];
      return null;
    }
    return d.value;
  },
  del: (key) => {
    if (bella.hasProperty(store, key)) {
      store[key] = null;
      delete store[key];
    }
    return cacher;
  },
  empty: () => {
    store = {};
    return cacher;
  }
};

bella.scheduler.every('10m', () => {
  if (bella.isEmpty(store)) {
    return false;
  }
  let now = bella.time();
  for (let k in store) {
    let d = store[k] || null;
    if (!d) {
      return null;
    }
    let t = d.time;
    if (now > t) {
      store[k] = null;
      delete store[k];
    }
  }
  return true;
});

var get = (id) => {
  return cacher.get(id) || null;
};

var set = (id, data) => {
  return cacher.set(id, data);
};

var del = (id) => {
  return cacher.del(id);
};

var fget = (f) => {
  let s = '';
  if (fs.existsSync(f)) {
    s = fs.readFileSync(f, 'utf8');
  }
  return s;
};

var fset = (f, data) => {
  let s = bella.isString(data) ? data : JSON.stringify(data);
  return fs.writeFileSync(f, s, 'utf8');
};

var fdel = (f) => {
  if (fs.existsSync(f)) {
    return fs.unlinkSync(f);
  }
  return false;
};

module.exports = {
  get: get,
  set: set,
  del: del,
  fget: fget,
  fset: fset,
  fdel: fdel
};
