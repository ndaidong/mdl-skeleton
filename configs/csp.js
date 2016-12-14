module.exports = {
  directives: {
    defaultSrc: [
      `'self'`
    ],
    scriptSrc: [
      `'self'`,
      `'unsafe-inline'`,
      `'unsafe-eval'`,
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com'
    ],
    styleSrc: [
      `'self'`,
      `'unsafe-inline'`,
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com'
    ],
    fontSrc: [
      `'self'`,
      `'unsafe-inline'`,
      `data:`,
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com'
    ],
    imgSrc: [
      `'self'`,
      `data:`,
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com'
    ],
    frameSrc: [
      `'self'`
    ],
    connectSrc: [
      `'self'`
    ],
    sandbox: [
      'allow-forms',
      'allow-scripts',
      'allow-popups',
      'allow-same-origin',
      'allow-top-navigation'
    ],
    objectSrc: [
      `'none'`
    ],
    reportUri: '/report-violation'
  },
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: false,
  safari5: false,
  loose: true
};
