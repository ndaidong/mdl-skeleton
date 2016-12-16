/**
 * For handling assets
 * @ndaidong
 **/

var path = require('path');
var fs = require('fs');
var http = require('http');

var bella = require('bellajs');
var Promise = require('promise-wtf');

const debug = require('debug');
const info = debug('compiler:info');
const error = debug('compiler:error');

var getFileContent = (f) => {
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
};

var setFileContent = (f, content) => {
  return fs.writeFileSync(f, content, 'utf8');
};

var getHTTPStatus = (code) => {
  return http.STATUS_CODES[code] || 'Unknown error';
};

var Handlebars = require('handlebars');
Handlebars.registerHelper({
  eq: (v1, v2) => {
    return v1 === v2;
  },
  ne: (v1, v2) => {
    return v1 !== v2;
  },
  lt: (v1, v2) => {
    return v1 < v2;
  },
  gt: (v1, v2) => {
    return v1 > v2;
  },
  lte: (v1, v2) => {
    return v1 <= v2;
  },
  gte: (v1, v2) => {
    return v1 >= v2;
  },
  and: (v1, v2) => {
    return v1 && v2;
  },
  or: (v1, v2) => {
    return v1 || v2;
  }
});

var postcss = require('postcss');
var postcssFilter = require('postcss-filter-plugins');
var cssnano = require('cssnano');
var cssnext = require('postcss-cssnext');
var nesting = require('postcss-nesting');
var mqpacker = require('css-mqpacker');

const POSTCSS_PLUGINS = [
  postcssFilter({
    silent: true
  }),
  cssnext,
  nesting,
  mqpacker({
    sort: true
  })
];

var babel = require('babel-core');
var parser = require('shift-parser');
var codegen = require('shift-codegen').default;

var transpile = (code) => {
  return babel.transform(code, {
    presets: [
      [
        'env', {
          targets: {
            browsers: [
              'safari 9',
              'ie 11',
              'Android 4',
              'iOS 7'
            ]
          }
        }
      ]
    ],
    plugins: [
      'transform-remove-strict-mode'
    ],
    comments: false,
    sourceMaps: true
  });
};

var jsminify = (code) => {
  let ast = parser.parseScript(code);
  return codegen(ast);
};

var fixPath = (p) => {
  if (!p) {
    return '';
  }
  p = path.normalize(p);
  p += p.endsWith('/') ? '' : '/';
  return p;
};

var removeNewLines = (s) => {
  return s.replace(/(?:\r\n|\r|\n)+/gm, '');
};

var pkg = require('../../package.json');
var config = require('./../../configs');

var builder = pkg.builder;
var cssDir = fixPath(builder.cssDir);
var jsDir = fixPath(builder.jsDir);
var distDir = fixPath(builder.distDir);
var vendorDir = fixPath(builder.vendorDir);

var postProcess = async (css) => {
  let plugins = POSTCSS_PLUGINS.slice(0);
  if (config.ENV !== 'local') {
    plugins.push(cssnano);
  }
  let result = await postcss(plugins).process(css);
  return result.css;
};

var parseLayout = async (input) => {
  let conf = config.settings;

  let dir = conf.viewDir + '/';
  let ext = conf.tplFileExtension;

  let {
    template = 'default',
    data = {}
  } = input;

  let file = path.normalize(`${dir}${template}${ext}`);

  let addToContainer = (html, filePath) => {
    let reg = /\{@extends\s+('?([A-Za-z0-9-./]+)'?|"?([A-Za-z0-9-./]+)"?)\}/i;
    let matches = html.match(reg);
    if (matches && matches.length > 2) {
      let place = matches[0];
      html = html.replace(place, '');
      let f = path.normalize(`${filePath}/${matches[2]}${ext}`);
      if (fs.existsSync(f)) {
        let content = getFileContent(f);
        if (content) {
          html = content.replace('{@content}', html);
        }
      }
    }
    return html;
  };

  let insertPartials = (html, dd) => {

    let getPlaceHolders = (_s) => {
      let reg = /\{@includes\s+('?([A-Za-z0-9-./]+)'?|"?([A-Za-z0-9-./]+)"?)\}/;
      return _s.match(reg);
    };

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
        let f = path.normalize(dd + '/' + m.name + ext);
        if (fs.existsSync(f)) {
          let content = getFileContent(f);
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

  let sLayout = await getFileContent(file);

  if (!sLayout) {
    throw new Error(`Template not found or wrong path: ${file}`);
  }

  sLayout = await addToContainer(sLayout, dir);
  sLayout = await insertPartials(sLayout, dir);

  try {
    let tmp = data.meta || {};
    data.meta = bella.copies(tmp, config.meta);
    data.revision = config.revision;
    let tplCompile = Handlebars.compile(sLayout);
    input.body = tplCompile(data);
  } catch (e) {
    error(e);
    throw new Error('Error while compiling with Handlebars');
  }

  return input;
};

var compileCSS = async (files) => {
  let s = '';
  let as = [];
  let vs = [];
  if (bella.isString(files)) {
    files = [files];
  }

  files.forEach((file) => {
    if (fs.existsSync(file)) {
      let x = getFileContent(file);
      let c = !file.includes(vendorDir);
      if (c) {
        as.push(x);
      } else {
        vs.push(x);
      }
    }
  });

  s = as.join('\n\n');

  if (!s.length > 0) {
    throw new Error('No CSS data');
  }
  let ps = vs.join('\n\n');
  let rs = await postProcess(s);
  return ps + '\n\n' + rs;
};

var parseCSS = async (input) => {
  let {context, body} = input;
  let css = context.css || false;
  if (!css) {
    return input;
  }

  let fstats = [config.revision];
  let cssfiles = [];
  if (bella.isString(css)) {
    css = [css];
  }

  css.forEach((file) => {
    let full = cssDir + file;
    let part = path.parse(full);
    let ext = part.ext;
    if (!ext) {
      full += '.css';
    }
    if (fs.existsSync(full)) {
      let stat = fs.statSync(full);
      fstats.push(stat.mtime);
      cssfiles.push(full);
    }
  });

  let fname = bella.md5(fstats.join(';'));

  let pname = '/css/' + fname + '.css';
  let saveAs = path.normalize(distDir + pname);

  let code = await compileCSS(cssfiles);
  setFileContent(saveAs, code);

  let style = `<link rel="stylesheet" type="text/css" href="${pname}?rev=${config.revision}"`;
  input.body = body.replace('{@style}', style);

  return input;
};


var compileJS = (files) => {
  let s = '';
  let as = [];
  if (bella.isString(files)) {
    files = [files];
  }

  files.forEach((file) => {
    if (fs.existsSync(file)) {
      let x = getFileContent(file);
      if (!file.includes(vendorDir)) {
        let r = transpile(x);
        x = r.code;
        if (config.ENV !== 'local') {
          x = jsminify(x);
        }
      }
      as.push(x);
    }
  });

  s = as.join(';');

  if (!s.length) {
    throw new Error('No JavaScript data');
  }
  return s;
};

var parseJS = async (input) => {
  let {context, body} = input;
  let js = context.js || false;
  if (!js) {
    return input;
  }

  let fstats = [config.revision];
  let jsfiles = [];
  if (bella.isString(js)) {
    js = [js];
  }

  js.forEach((file) => {
    let full = jsDir + file;
    let ext = path.extname(full);
    if (!ext || ext !== '.js') {
      let _full = '';
      if (fs.existsSync(full + '.js')) {
        _full = full + '.js';
      }
      if (full.includes(vendorDir) && config.ENV !== 'local' && fs.existsSync(full + '.min.js')) {
        _full = full + '.min.js';
      }
      full = _full;
    }
    if (fs.existsSync(full)) {
      let stat = fs.statSync(full);
      fstats.push(stat.mtime);
      jsfiles.push(full);
    }
  });

  let fname = bella.md5(fstats.join(';'));

  let pname = '/js/' + fname + '.js';
  let saveAs = path.normalize(distDir + pname);

  let code = await compileJS(jsfiles);
  setFileContent(saveAs, code);

  let script = `<script type="text/javascript" src="${pname}?rev=${config.revision}"></script>`;
  input.body = body.replace('{@script}', script);
  return input;
};

var normalize = (input) => {
  let {body = ''} = input;
  input.body = removeNewLines(body);
  return input;
};

var compile = async (input) => {

  let {
    template
  } = input;

  if (bella.isNumber(template)) {
    let errorCode = template;
    let html = await getFileContent('./app/views/error.html');
    let message = getHTTPStatus(errorCode);
    let body = bella.template(html).compile({
      title: `${errorCode} ${message}`,
      errorCode: String(errorCode),
      message
    });
    return {
      status: errorCode,
      body
    };
  }

  let output = await parseLayout(input);
  output = await parseCSS(output);
  output = await parseJS(output);
  output = await normalize(output);

  return {
    status: 200,
    body: output.body
  };
};


var render = async (template, data, context, ctx) => {
  let output = await compile({template, data, context});
  ctx.status = output.status;
  ctx.body = output.body;
};

module.exports = {
  compile,
  render,
  jsminify,
  fixPath
};

