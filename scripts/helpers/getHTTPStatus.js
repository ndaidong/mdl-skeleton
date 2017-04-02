// getHTTPStatus

var http = require('http');

var getHTTPStatus = (code) => {
  return http.STATUS_CODES[code] || 'Unknown error';
};

module.exports = getHTTPStatus;
