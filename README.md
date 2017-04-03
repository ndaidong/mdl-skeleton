# Material Design Lite skeleton

With the newest stacks: Koa, Rollup, PostCSS and Testcafe.

[![Build Status](https://travis-ci.org/ndaidong/mdl-skeleton.svg?branch=master)](https://travis-ci.org/ndaidong/mdl-skeleton)
[![Dependency Status](https://gemnasium.com/badges/github.com/ndaidong/mdl-skeleton.svg)](https://gemnasium.com/github.com/ndaidong/mdl-skeleton)


# Usage

```
git clone https://github.com/ndaidong/mdl-skeleton.git
cd mdl-skeleton

// install and run with Node.js
npm install
npm start

// or run it through a docker container
docker-compose up
```

If everything goes well, you can get the output at: http://localhost:8081


# How does it work?


### Setting up

After running "npm start", it will do the following tasks:

- Load settings from "/configs/index"
- Start KoaJS server with specified settings
- Calling setup() method in "/scripts/builder"

The setup() method take 2 actions: make several needed folders and download the required third party CSS and JS resources for you.

Resources declaration is a part of package.json:

```
  // ...
  "setup": {
    "css": {
      "mui": "http://cdn.muicss.com/mui-0.9.12/css/mui.min.css"
    },
    "js": {
      "mui": "http://cdn.muicss.com/mui-0.9.12/js/mui.min.js"
    }
  },
```

With the above setting, the builder would download 2 files mui.min.css and mui.min.js into "/dist/css" and "dist/js". Their name will be changed to related property - "mui".

This tiny util may save for you so much time in comparison with installing the whole repository via "npm install muicss". It just gets what you really need.


### Serving

Once the website is running, any request will be processed by routers and pages. The routers  are defined in "/routers", by [koa-router](https://www.npmjs.com/package/koa-router).

Each of path will be mapped to a "page", where we set the values for response. These values include: template data, JavaScript and CSS resources. Here is a simple page:

```
// pages/home

var start = (ctx) => {

  let data = {
    title: 'Welcome',
    message: 'Why we do what we do?'
  };

  let context = {
    css: [
      'vendor/css/mui.css',
      'css/style.css'
    ],
    js: {
      files: [
        'vendor/js/mui.js'
      ],
      entry: 'js/app.js'
    },
    SDATA: {
      username: 'alice'
    }
  };

  ctx.render('landing', data, context);
};

module.exports = start;
```

While template data is belong to Mustache engine, JavaScript and CSS resources are optimized by a set of smart tools as Rollup, Babel, PostCSS.

ctx.render expects 3 parameters:

- layout: the main layout for this page
- data: to be processed by template engine
- context: includes CSS/JS and shared data (from server to client)

Note that:

- in context declaration, CSS is an array, while JS is an object with 2 properties "files" and "entry". The JS file you set to context.js.entry will be compiled by Rollup.
- you just need to declare relative path, the program will look in all directories specified by /configs/settings -> assetsDirs to find related files.

In reality, the program is trying to find the correct path. The following ways are equivalent:


```
- 'dist/vendor/css/mui.css'
- 'vendor/css/mui.css'
- 'css/mui.css'
- 'mui.css'
- 'mui'
```


The output always meets the requirements of today web standard:

- Minify JavaScript, CSS
- Concat JavaScript and CSS files
- Prefix assets to prevent cache
- Standard HTML5 structure with oGraph and Twitter card
- No longer download unused JavaScript code. Thanks to Rollup tree-shaking :)

In production, everything is cached by [lru-cache](https://www.npmjs.com/package/lru-cache). This would decrease the response time at least 300%.


# Layout

All templates are located in /configs/settings -> viewDir

It uses Mustache to handle template data and some custom syntaxes to extend or include other template files.

The following file will get 3 partials added before being inserted into a container named "layout":

```
{@extends 'layout'}
<div>
  {@includes 'common/header'}
  {@includes 'home/main'}
  {@includes 'common/footer'}
</div>
```


# Tech stacks

- [Material Design](https://material.io/guidelines/)
- [KoaJS](http://koajs.com/)
- [RollupJS](https://rollupjs.org/):
  - [Babel](http://babeljs.io/)
  - [ES2015](http://es6-features.org/)
  - [ES2015](http://es6-features.org/)
- [PostCSS](http://postcss.org/):
  - [CSSNext](http://cssnext.io/)
  - [rucksack](https://simplaio.github.io/rucksack/)
  - [mqpacker](https://github.com/hail2u/node-css-mqpacker)
  - [PreCSS](https://github.com/jonathantneal/precss)
  - [CSSNano](http://cssnano.co/)
- Template engine: [Mustache](http://mustache.github.io/)
- E2E testing: [TestCafe](https://devexpress.github.io/testcafe/)


# License

The MIT License (MIT)
