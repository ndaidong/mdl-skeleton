exports.config = {
  directConnect: true,
  capabilities: {
    'browserName': 'chrome'
  },
  specs: ['../test/e2e/*.js'],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
