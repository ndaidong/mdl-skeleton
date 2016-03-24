/**
 * Consumer module, a request wrapper to deal with remote API
 * Exports: get, post, put, del
 * @ndaidong
 **/

/* eslint guard-for-in: 0*/
/* eslint no-console: 0*/

import bella from 'bellajs';
import request from 'request';
import Promise from 'bluebird';

var config = require('../configs/base');

var restServer = config.restServer;
var restURL = restServer.baseURL;

var parse = (data) => {
  let s = '';
  if (bella.isString(data)) {
    s = data;
  } else if (bella.isArray(data) || bella.isObject(data)) {
    let ar = [];
    for (let k in data) {
      let val = data[k];
      if (bella.isString(val)) {
        val = bella.encode(val);
      } else if (bella.isArray(val) || bella.isObject(val)) {
        val = JSON.stringify(val);
      }
      ar.push(bella.encode(k) + '=' + val);
    }
    if (ar.length > 0) {
      s = ar.join('&');
    }
  }
  return s;
};

export var get = (endpoint, params, token) => {
  let url = restURL + endpoint + (params ? '?' + parse(params) : '');
  return new Promise((resolve, reject) => {
    if (endpoint !== '/auth') {
      return reject({
        error: 1,
        message: 'Authorization ticket is required in order to access API system.'
      });
    }
    return request.get(
      {
        url: url,
        headers: {
          'X-Access-Token': token,
          'Accepts': 'application/json'
        }
      },
      (err, response, body) => {
        if (err) {
          return reject(err);
        }
        try {
          var ob = bella.isString(body) ? JSON.parse(body) : body;
          if (ob && bella.isObject(ob)) {
            return resolve(ob);
          }
          return reject({
            error: 'No data!',
            source: url
          });
        } catch (e) {
          console.trace(e);
          return reject(e);
        }
      }
    );
  });
};

export var post = (endpoint, data, token) => {
  let url = restURL + endpoint;

  return new Promise((resolve, reject) => {
    request.post(
      {
        url: url,
        headers: {
          'X-Access-Token': token,
          'Accepts': 'application/json'
        },
        form: data
      },
      (err, response, body) => {
        if (err) {
          console.trace(err);
          return reject(err);
        }
        try {
          let ob = bella.isString(body) ? JSON.parse(body) : body;
          if (ob && bella.isObject(ob)) {
            return resolve(ob);
          }
          return reject({
            error: 'No data!',
            source: url
          });
        } catch (e) {
          console.log(url);
          console.log(data);
          console.trace(e);
          return reject(e);
        }
      }
    );
  });
};

var sendRequest = (method, endpoint, data, token) => {
  let url = restURL + endpoint;
  return new Promise((resolve, reject) => {
    request(
      {
        url: url,
        method: method,
        headers: {
          'X-User-Token': token,
          'Accepts': 'application/json'
        },
        json: data
      },
      (err, response, body) => {
        if (err) {
          return reject(err);
        }
        try {
          let ob = bella.isString(body) ? JSON.parse(body) : body;
          if (ob && bella.isObject(ob)) {
            return resolve(ob);
          }
          return reject({
            error: 'No data!',
            source: url
          });
        } catch (e) {
          console.trace(e);
          return reject(e);
        }
      }
    );
  });
};

export var put = (endpoint, data, token) => {
  return sendRequest('PUT', endpoint, data, token);
};
export var del = (endpoint, data, token) => {
  return sendRequest('DELETE', endpoint, data, token);
};
