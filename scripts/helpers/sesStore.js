// sesStore.js

var readFile = require('./readFile');
var writeFile = require('./writeFile');
var delFile = require('./delFile');

var config = require('../../configs');
var {
  storeDir
} = config.settings;

var sesStore = {
  get: async (key) => {
    let f = `${storeDir}/sessions/${key}`;
    let c = await readFile(f);
    return c ? JSON.parse(c) : null;
  },
  set: async (key, val) => {
    let f = `${storeDir}/sessions/${key}`;
    await writeFile(f, JSON.stringify(val));
  },
  destroy: async (key) => {
    let f = `${storeDir}/sessions/${key}`;
    await delFile(f);
  }
};

module.exports = sesStore;
