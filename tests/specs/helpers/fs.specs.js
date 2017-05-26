/**
 * Testing
 * @ndaidong
 */

var test = require('tape');
var bella = require('bellajs');

var {existsSync} = require('fs');

var {
  readFile,
  writeFile,
  delFile
} = require('../../../app/utils');

test('Check file management utils', (assert) => {
  assert.ok(bella.isFunction(readFile), 'readFile must be a function');
  assert.ok(bella.isFunction(writeFile), 'writeFile must be a function');
  assert.ok(bella.isFunction(delFile), 'delFile must be a function');

  let tmpFile = './nooop.txt';
  let tmpContent = 'abc';
  writeFile(tmpFile, tmpContent);
  assert.ok(existsSync(tmpFile), `${tmpFile} must be created`);
  assert.ok(readFile(tmpFile) === tmpContent, `${tmpFile} file's content must be ${tmpContent}`);
  delFile(tmpFile);
  assert.ok(!existsSync(tmpFile), `${tmpFile} must be removed`);
  assert.end();
});
