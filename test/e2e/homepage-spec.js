/**
 * Testing
 * @ndaidong
 */

/* global describe it beforeEach browser expect */

describe('Homepage', () => {

  beforeEach(() => {
    browser.ignoreSynchronization = true;
    browser.get('http://127.0.0.1:9999');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toMatch('MDL skeleton');
  });
});
