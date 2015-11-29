/**
 * Testing
 * @ndaidong
 */

/* global describe it beforeEach browser expect */
/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-new-func: 0*/

'use strict';

describe('Homepage', () => {

  beforeEach(() => {
    browser.ignoreSynchronization = true;
    browser.driver.get('http://127.0.0.1:9999');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toMatch('MDL skeleton');
  });
});
