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

After running "npm start", it will do the following tasks:

- Load settings from "/configs/index"
- Start KoaJS server with specified settings
- Make some folders by calling setup() method in "/scripts/builder"

Once the website is running, any request will be processed by routers and pages. The routers  are defined in "/routers", by [koa-router](https://www.npmjs.com/package/koa-router).

Each of path will be mapped to a "page", where we set the values for response. These values include: template data, JavaScript and CSS resources.

While template data is belong to Mustache engine, JavaScript and CSS resources are optimized by a set of smart tools as Rollup, Babel, PostCSS. So that the output always meets the requirements of today web standard:

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
