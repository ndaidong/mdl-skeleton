// parseLayout

var fs = require('fs');
var path = require('path');

var debug = require('debug');
var info = debug('app:info');

var Mustache = require('mustache');
var cheerio = require('cheerio');
var htmlmin = require('html-minifier').minify;

var config = require('../../configs');
var {meta: defaultMeta, settings, revision, ENV} = config;

var readFile = require('./readFile');
var parseCSS = require('./parseCSS');
var parseJS = require('./parseJS');

var optimize = (html, css = '', js = '') => {

  info('Optimizing HTML structure...');
  let $ = cheerio.load(html, {
    normalizeWhitespace: true
  });

  let rev = ENV === 'production' ? revision : Date.now();

  if (css) {
    let styleTag = `<link rel="stylesheet" type="text/css" href="${css}?rev=${rev}" />`;
    $('head').append(styleTag);
  }

  if (js) {
    let scriptTag = `<script type="text/javascript" src="${js}?rev=${rev}"></script>`;
    $('body').append(scriptTag);
  }

  let sHTML = htmlmin($.html(), {
    collapseWhitespace: true,
    preserveLineBreaks: true,
    quoteCharacter: '"',
    removeComments: true,
    removeEmptyAttributes: true,
    useShortDoctype: true
  });

  info('Optimizing HTML finished.');
  return sHTML;
};

var getPlaceHolders = (s) => {
  let reg = /\{@includes\s+('?([A-Za-z0-9-./]+)'?|"?([A-Za-z0-9-./]+)"?)\}/;
  return s.match(reg);
};

var addToContainer = (html, dir, ext = '.html') => {
  let reg = /\{@extends\s+('?([A-Za-z0-9-./]+)'?|"?([A-Za-z0-9-./]+)"?)\}/i;
  let matches = html.match(reg);
  if (matches && matches.length > 2) {
    let place = matches[0];
    html = html.replace(place, '');
    let f = path.normalize(`${dir}/${matches[2]}${ext}`);
    if (fs.existsSync(f)) {
      let content = readFile(f);
      if (content) {
        html = content.replace('{@content}', html);
      }
    }
  }
  return html;
};

var insertPartials = (html, dir, ext = '.html') => {

  let a = html.split('\n');
  let matches = [];
  if (a.length > 0) {
    a.forEach((line) => {
      if (line.includes('@includes')) {
        let m = getPlaceHolders(line);
        if (m && m.length > 2) {
          matches.push({
            place: m[0],
            name: m[2]
          });
        }
      }
    });
  }

  if (matches.length > 0) {
    matches.forEach((m) => {
      let place = m.place;
      let f = path.normalize(`${dir}/${m.name}${ext}`);
      if (fs.existsSync(f)) {
        let content = readFile(f);
        if (content) {
          let dirName = path.dirname(f);
          content = insertPartials(content, dirName);
          html = html.replace(place, content);
        }
      }
    });
  }
  return html;
};

var parseLayout = (input, pathMD5 = '') => {

  info('Parsing HTML layout...');
  let {
    viewDir,
    tplFileExtension: ext
  } = settings;

  let {
    layout,
    data,
    context
  } = input;

  let html = readFile(`${viewDir}${layout}${ext}`);

  if (html) {
    html = addToContainer(html, viewDir, ext);
    html = insertPartials(html, viewDir, ext);
    let mixed = Object.assign({}, defaultMeta, data);
    html = Mustache.render(html, mixed);
  }

  let {
    css = [],
    js = {}
  } = context;

  let cssFile = css ? parseCSS(css, pathMD5) : '';
  let jsFile = js ? parseJS(js, pathMD5) : '';

  info('Finish parsing HTML layout.');
  return optimize(html, cssFile, jsFile);
};

module.exports = parseLayout;
