// utils / index

const logger = require('./logger');

const readFile = require('./readFile');
const writeFile = require('./writeFile');
const delFile = require('./delFile');

module.exports = {
  logger,
  readFile,
  writeFile,
  delFile,
};
