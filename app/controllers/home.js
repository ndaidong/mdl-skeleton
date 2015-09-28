/**
 * HomeController
**/

export var start = (req, res) => {

  let data = {
    title: 'Name & Title'
  }

  let css = [
    'styles'
  ];

  let js = [
    'packages/material',
    'packages/bella',
    'packages/fetch',
    'packages/promise',
    'app'
  ];

  return res.publish('landing', data, {css: css, js: js});
}

