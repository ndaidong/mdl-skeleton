module.exports = {
  reportUri: '/csp-report',
  reportOnly: false,
  directives: {
    'default-src': [
      `'self'`
    ],
    'script-src': [
      `'self'`,
      `'unsafe-inline'`,
      `'unsafe-eval'`,
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com',
      '*.google.com',
      '*.twitter.com'
    ],
    'style-src': [
      `'self'`,
      `'unsafe-inline'`,
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com',
      '*.google.com',
      '*.twitter.com'
    ],
    'font-src': [
      `'self'`,
      `'unsafe-inline'`,
      'data:',
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com',
      '*.google.com',
      '*.twitter.com'
    ],
    'img-src': [
      `'self'`,
      'data:',
      '*.googleapis.com',
      '*.gstatic.com',
      '*.google-analytics.com',
      '*.google.com',
      '*.twitter.com'
    ],
    'frame-src': [
      `'self'`
    ],
    'connect-src': [
      `'self'`
    ],
    sandbox: [
      'allow-forms',
      'allow-scripts',
      'allow-popups',
      'allow-same-origin',
      'allow-top-navigation'
    ],
    'object-src': [
      `'none'`
    ]
  }
};
