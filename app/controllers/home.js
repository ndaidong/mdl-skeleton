/**
 * HomeController
**/

export var start = (req, res) => {

  let data = {
    meta: {
      title: 'Name & Title'
    }
  }

  let context = {
    css: [
      'styles'
    ],
    js: [
      'packages/material',
      'packages/bella',
      'packages/fetch',
      'packages/promise',
      'app'
    ]
  }

  return res.publish('landing', data, context);
}

