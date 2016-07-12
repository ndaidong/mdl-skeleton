# Material Design Lite skeleton

How to quickly generate a new website using Node.js and Material Design Lite? Try this:

```
git clone https://github.com/ndaidong/mdl-skeleton.git
cd mdl-skeleton
npm install
npm start
```

# Contents

* [Why this is cool?](#why-this-is-cool)
  * [Make use of advanced techniques](#make-use-of-advanced-techniques)
  * [Extending and including templates](#extending-and-including-templates)
  * [Smart builder tool](#smart-builder-tool)
  * [Standard front-end output](#standard-front-end-output)
* [Installation](#installation)
* [Live examples](#live-examples)
* [Protractor](#protractor)
* [Tech stacks](#tech-stacks)
* [License](#license)


### Why this is cool?

#### Make use of advanced techniques

Built-in compiler, that compiles CSS resources with PostCSS and transpiles ES6 with Babel. Declare these resources within controllers. It also helps to fastly share data from server to client.

```
/**
 * HomeController
 **/

var start = (req, res) => {

  // this block will be parsed by Handlebars engine and compiled to the template
  let data = {
    meta: {
      title: 'MDL skeleton'
    },
    title: 'Name & Title'
  };

  // this will be processed by PostCSS, Babel
  let context = {
    css: [
      'vendor/mdl',
      'styles'
    ],
    js: [
      'vendor/material',
      'vendor/doc',
      'app'
    ],
    sdata: {
      user: user // this will be shared to client script
    }
  };

  return res.render('landing', data, context);
};

module.exports = {
  start
};

```
See [/app/workers/compiler.js](https://github.com/ndaidong/mdl-skeleton/blob/master/app/workers/compiler.js)

Note that Express's *res.render* method has been added the third parameter *context*, an object with it we can declare css, js and SDATA (shared data) for each of context (page).

While css and js resources will be compiled, minified, and merged into just one file, SDATA will be shared to client script as a global object.

Example:

```
var template = 'account';

var data = {
  title: 'Account edit'
  username: user.username
};

var context = {
  css: [
    'normalize',
    'form',
    'account.less'
  ],
  js: [
    'libs/jquery-min',
    'libs/formidable',
    'modules/account'
  ],
  sdata: {
    user: user,
    permission: permission
  }
};

res.render(template, data, context);

// client side script can access sdata via window.SDATA
```

#### Extending and including templates

New syntaxes to Handlebars based template so it can extend or include other templates like Jade.

```
{@extends 'layout'}
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
  {@includes 'common/header'}
  {@includes 'home/main'}
  {@includes 'common/footer'}
</div>
```

Take a look at [/app/views/](https://github.com/ndaidong/mdl-skeleton/tree/master/app/views)


#### Smart builder tool

In-app automation builder runs when node.js process starts, to generate needed directories, download/minify javascript packages and optimize images. You can declare these resources in package.json file.

```
// new group of definition within package.json
  "builder": {
    "directories": [
      "storage/cache",
      "storage/tmp"
    ],
    "cssDir": "assets/css",
    "jsDir": "assets/js",
    "imgDir": "assets/images",
    "fontDir": "assets/fonts",
    "distDir": "dist",
    "vendorDir": "vendor",
    "css": {
      "mdl": "https://code.getmdl.io/1.1.3/material.indigo-pink.min.css"
    },
    "javascript": {
      "bella": "https://raw.githubusercontent.com/techpush/bella.js/master/src/bella.js",
      "fetch": "https://raw.githubusercontent.com/typicode/fetchival/master/index.js",
      "material": "https://storage.googleapis.com/code.getmdl.io/1.1.3/material.js",
      "promise": "https://raw.githubusercontent.com/jakearchibald/es6-promise/master/dist/es6-promise.js",
      "ractive": "http://cdn.ractivejs.org/latest/ractive.js"
    }
  }

// when node.js server starts, it will
// - create 4 folders: "storage", "storage/cache", "storage/tmp" and "dist"
// - download CSS files defined with "css" property into vendorDir
// - download JS files defined with "javascript" property into vendorDir. Rename and minify them.
// - copy css, js, images under "assets/" to "dist/"
```

See [/app/workers/builder.js](https://github.com/ndaidong/mdl-skeleton/blob/master/app/workers/builder.js)

#### Standard front-end output

With the methods we are using, the last output is always fit the requirements of today web standard:

- Minify JavaScript, CSS and SVG images
- Concat JavaScript and CSS files
- Prefix assets to prevent cache
- Lint JavaScript using ESLint
- Standard HTML5 structure with oGraph and Twitter card support
- Ready for E2E testing

Here are the test results for our website [FOMO](http://fomo.link/) using [SecurityHeader](https://securityheaders.io/?q=http%3A%2F%2Ffomo.link%2F), [WebPagetest](http://www.webpagetest.org/result/160401_JT_WHW/) and [GTmetrix](https://gtmetrix.com/reports/fomo.link/YIHdv7eN).


### Installation

```
git clone https://github.com/ndaidong/mdl-skeleton.git
cd mdl-skeleton
npm install
mkdir app/configs/env
cp app/configs/vars.sample.js app/configs/env/vars.js
npm run setup
npm start
```

Update app/configs/env/vars.js to fit your system.
Any property defined within app/configs/env/vars.js will overwrite the same value in app/configs/base.js as default.


Starting:

```
node server.js

// or with npm
npm start

// or with PM2
pm2 start server.js -i 0 --name=main

```

Then you would got this:

![Material Design Lite](http://i.imgur.com/SJC0rl5.png)


*Original template:* http://www.getmdl.io/templates/text-only/index.html


### Live examples:

- [TechPush](http://techpush.xyz)
- [FOMO](http://fomo.link/)

![TechPush](http://i.imgur.com/ETERBvf.png)

![FOMO](http://i.imgur.com/U72Cyq1.png)


### Protractor

If you want to write E2E test with [Protractor](http://www.protractortest.org), please do the following steps:

1. Install protractor & update Selenium driver

  ```
  sudo npm install -g protractor
  sudo webdriver-manager update
  ```

2. Start Selenium driver

  ```
  webdriver-manager start
  ```

3. Start the website

  At another terminal tab, move the cursor into project folder, then...

  ```
  cd mdl-skeleton
  npm start
  ```

4. Run test scripts:

  At the third terminal tab, also move the cursor into project folder, then...

  ```
  cd mdl-skeleton
  protractor test/protractor.conf.js
  ```

5. Update test scenario

  Under /test folder, now you can update protractor configurations and test cases to fit your own project.


### Tech stacks

Don't miss these hot technologies:

- [Material Design Lite](http://www.getmdl.io/)
- [ES6](http://es6-features.org/) with [Babel](http://babeljs.io/)
- Modern CSS techniques with [PostCSS](http://postcss.org/):
  - [CSSNext](http://cssnext.io/)
  - [rucksack](https://simplaio.github.io/rucksack/)
  - [mqpacker](https://github.com/hail2u/node-css-mqpacker)
  - [PreCSS](https://github.com/jonathantneal/precss)
  - [CSSNano](http://cssnano.co/)
- Templating with [Handlebars](http://handlebarsjs.com/)
- E2E testing with [Protractor](http://www.protractortest.org/)


### License

The MIT License (MIT)
