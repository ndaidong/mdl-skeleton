# Material Design Lite skeleton

How to quickly generate a new website using Node.js and Material Design Lite? Try this:

```
git clone https://github.com/ndaidong/mdl-skeleton.git
cd mdl-skeleton
npm install
node server.js
```


### Why this is cool?

#### Make use of advanced techniques

Built-in compiler, that compiles CSS resources with LESS and transpiles ES6 with Traceur. Declare these resources within controllers. It also helps to fastly share data from server to client.

```
/**
 * HomeController
**/

export var start = (req, res) => {

  // this block will be parsed by Handlebars engine and compiled to the template
  let data = {
    meta: {
      title: 'Name & Title'
    },
    user: res.user
  }

  // this will be parsed by LESS, Babel
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
    ],
    sdata: {
      user: user // this will be shared to client script
    }
  }

  return res.render('landing', data, context);
}

```
See [/app/workers/compiler.js](https://github.com/ndaidong/mdl-skeleton/blob/master/app/workers/compiler.js)

*Note:*

We have overwritten ExpressJS' res.render function by defining the following line within server.js:

```
app.use(compiler.io);
```

So the res.render now expects 3 parameters as below:

- template: template file, similar to res.render(template)
- data: an object will be Handlebars compile to template file
- context: another object with it we can declare css, js and SDATA (shared data). While css and js resources will be compiled and groupped to one file, ADATA will be shared to client script as a global object.

Example:

```
var template = 'account';

var data = {
  title: 'Account edit'
  username: user.username
}

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
}

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

- In-app automation builder runs when node.js process starts, to generate needed directories, download/minify javascript packages and optimize images. You can declare these resources in package.json, no longer need to use bower or browserify.

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
  "distDir": "dist",
  "files": {
    "fetch": "https://raw.githubusercontent.com/typicode/fetchival/master/index.js",
    "material": "https://storage.googleapis.com/code.getmdl.io/1.0.4/material.min.js",
    "ractive": "http://cdn.ractivejs.org/latest/ractive.js"
  }
}

// when node.js server starts, it will
// - create 4 folders: "storage", "storage/cache", "storage/tmp" and "dist"
// - copy css, js, images under "assets/" to "dist/"
// - download JS files defined with "files" property. Rename and minify them.
```

See [/app/workers/builder.js](https://github.com/ndaidong/mdl-skeleton/blob/master/app/workers/builder.js)


### Installation

```
git clone https://github.com/ndaidong/mdl-skeleton.git
cd mdl-skeleton
npm install
mkdir app/configs/env
cp app/configs/vars.sample.js app/configs/env/vars.js
gulp setup
```

Update app/configs/env/vars.js to fit your system.
Any property defined within app/configs/env/vars.js will overwrite the same value in app/configs/base.js as default.


Don't miss the best of technologies:

- [Material Design Lite](http://www.getmdl.io/)
- ES6 with [Traceur](https://github.com/google/traceur-compiler) 
- [ExpressJS](http://expressjs.com)
- [Handlebars](http://handlebarsjs.com/)
- [LESS](http://lesscss.org/)
- [Mongoose](http://mongoosejs.com/)
- [Gulp](http://gulpjs.com/)


### Starting

```
node server.js

// or with PM2

pm2 start server.js -i 0 --name=main

```

### Screenshot

![Material Design Lite](http://i.imgur.com/SJC0rl5.png)

Original template: http://www.getmdl.io/templates/text-only/index.html


### Protractor

If you want to write E2E test with [Protractor](http://www.protractortest.org), just place the test scripts under /test folder and install the tools as below:

```
sudo npm install -g protractor
sudo webdriver-manager update
webdriver-manager start
```

With the last command, we've got Selenium server running. Now open another terminal tab to start testing:

```
cd mdl-skeleton
protractor test/protractor.conf.js
```


### License

Apache License Version 2.0

