/**
 * Compile and transpile client data
 * @ndaidong
 **/

import path from 'path';
import fs from 'fs';
import URL from 'url';
import less from 'less';
import mincss from 'mincss';
import bella from 'bellajs';
import async from 'async';
import Promise from 'bluebird';

var Handlebars = require('handlebars');
var UglifyJS = require('uglify-js');
var mkdirp = require('mkdirp').sync;

var pkg = require('../../package.json');
var config = require('./../../configs/base');

var builder = pkg.builder;
var cssDir = builder.cssDir + '/';
var jsDir = builder.jsDir + '/';
var distDir = builder.distDir;

var removeNewLines = (s) => {
  s = s.replace(/(?:\r\n|\r|\n)+/gm, '');
  return s;
}

export var lessify = (css) => {

  return new Promise((resolve, reject) => {

    let fstats = [];
    let acss = [], aless = [];
    if(bella.isString(css)){
      css = [css];
    }

    css.forEach((file) => {
      let full = cssDir + file;
      let part = path.parse(full);
      let ext = part.ext;
      if(!ext){
        full += '.css';
      }
      if(fs.existsSync(full)){
        let stat = fs.statSync(full);
        fstats.push(stat.mtime);
        if(ext === '.less'){
          aless.push(full);
        }
        else{
          acss.push(full);
        }
      }
    });

    let fname = bella.md5(fstats.join(';'));

    let pname = '/css/' + fname + '.css';
    let saveAs = distDir + pname;

    if(fs.existsSync(saveAs)){
      return resolve(pname);
    }

    let sCSS = '';
    let series = [];

    acss.forEach((file) => {
      let s = fs.readFileSync(file, 'utf8');
      series.push((next) => {
        sCSS += s;
        next();
      });
    });

    aless.forEach((file) => {
      let s = fs.readFileSync(file, 'utf8');
      series.push((next) => {
        less.render(s).then((output) => {
          sCSS += output.css;
          next();
        });
      });
    });

    async.series(series, (err) => {
      if(err){
        return reject(err);
      }
      if(sCSS.length){
        try{
          if(config.ENV !== 'local'){
            let minified = mincss.minify(sCSS);
            fs.writeFileSync(saveAs, minified.css, 'utf8');
          }
          else{
            fs.writeFileSync(saveAs, sCSS, 'utf8');
          }
          resolve(pname);
        }
        catch(e){
          reject(e);
        }
      }
      else{
        reject({error: 'Unknown error'});
      }
    });
  });
}

export var babelize = (js) => {

  return new Promise((resolve, reject) => {

    let fstats = [], jsfiles = [];
    if(bella.isString(js)){
      js = [js];
    }

    js.forEach((file) => {
      let full = jsDir + file;
      let part = path.parse(full);
      let ext = part.ext;
      if(!ext){
        let _full = '';
        if(fs.existsSync(full + '.js')){
          _full = full + '.js';
        }
        if((config.ENV !== 'local' || full.match(/\/packages\//)) && fs.existsSync(full + '.min.js')){
          _full = full + '.min.js';
        }
        full = _full;
      }
      if(fs.existsSync(full)){
        let stat = fs.statSync(full);
        fstats.push(stat.mtime);
        jsfiles.push(full);
      }
    });

    let fname = bella.md5(fstats.join(';'));

    let pname = '/js/' + fname + '.js';
    let saveAs = distDir + pname;

    if(fs.existsSync(saveAs)){
      return resolve(pname);
    }

    let sJS = '';
    let series = [];

    jsfiles.forEach((file) => {
      series.push((next) => {
        let s = fs.readFileSync(file, 'utf8');
        sJS += (s + ';');
        next();
      });
    });

    async.series(series, (err) => {
      if(err){
        console.trace(err);
        return reject(err);
      }
      if(sJS.length){
        try{
          if(config.ENV !== 'local'){
            let minified = UglifyJS.minify(sJS, {fromString: true});
            fs.writeFileSync(saveAs, minified.code, 'utf8');
          }
          else{
            fs.writeFileSync(saveAs, sJS, 'utf8');
          }
          resolve(pname);
        }
        catch(e){
          reject(e);
        }
      }
      else{
        reject({error: 'Unknown error'});
      }
    });
  });
}

export var transform = (req, res, next) => {
  let url = req.url;
  let oUrl = URL.parse(url);
  let pathname = oUrl.pathname;
  if(!pathname.match(/\/js\/modules\/(.+)\.js/) && !pathname.match(/\/js\/app\.js/)){
    return next();
  }

  let ext = path.extname(pathname);
  if(ext !== '.js'){
    return next();
  }

  let dirname = path.dirname(pathname);
  let filename = path.basename(pathname, ext);
  let file = './assets' + pathname;

  if(!fs.existsSync(file)){
    return next();
  }

  let output = (str) => {
    if(!res.headersSent){
      res.set('Content-Type', 'application/javascript; charset=utf-8');
      res.send(str);
    }
  }

  let stat = fs.statSync(file);
  let mtime = bella.date.strtotime(stat.mtime);
  let rd = './' + distDir + dirname;
  if(!fs.existsSync(rd)){
    mkdirp(rd);
  }

  let saveAs = path.resolve(rd + '/' + filename + '-' + mtime + ext);
  if(fs.existsSync(saveAs)){
    return fs.readFile(saveAs, 'utf8', (e, s) => {
      output(s);
    });
  }

  let minified = {};
  let code = '';
  if(config.ENV !== 'local'){
    minified = UglifyJS.minify(file);
    code = minified.code;
  }
  else{
    code = fs.readFileSync(file, 'utf8');
  }
  output(code);
  return fs.writeFileSync(saveAs, code, 'utf8');
}


export var build = (layout, data = {}, context = {}) => {

  let conf = config.settings;

  let dir = conf.viewDir + '/';
  let ext = conf.tplFileExtension;

  let file = path.normalize(dir + layout + ext);

  let getPartial = (ss, dd) => {

    let getPlaceHolders = (_s) => {
      let reg = /\{@includes\s+(\'?([A-Za-z0-9-.\/]+)\'?|\"?([A-Za-z0-9-.\/]+)\"?)\}/;
      return _s.match(reg);
    }

    let a = ss.split('\n');
    let matches = [];
    if(a.length > 0){
      a.forEach((line) => {
        if(line.includes('@includes')){
          let m = getPlaceHolders(line);
          if(m && m.length > 2){
            matches.push({place: m[0], name: m[2]});
          }
        }
      });
    }

    if(matches.length > 0){
      matches.forEach((m) => {
        let place = m.place;
        let f = path.normalize(dd + '/' + m.name + ext);
        if(fs.existsSync(f)){
          let cs = fs.readFileSync(f, 'utf8');
          if(cs){
            let ps = path.dirname(f);
            cs = getPartial(cs, ps);
            ss = ss.replace(place, cs);
          }
        }
      });
    }
    return ss;
  }

  let getContainer = (ss, dd) => {
    let reg = /\{@extends\s+(\'?([A-Za-z0-9-.\/]+)\'?|\"?([A-Za-z0-9-.\/]+)\"?)\}/i;
    let matches = ss.match(reg);
    if(matches && matches.length > 2){
      let place = matches[0];
      ss = ss.replace(place, '');
      let f = path.normalize(dd + '/' + matches[2] + ext);
      if(fs.existsSync(f)){
        let cs = fs.readFileSync(f, 'utf8');
        if(cs){
          ss = cs.replace('{@content}', ss);
        }
      }
    }
    return ss;
  }

  let continuable = true;
  let sHtml = '';

  return new Promise((resolve, reject) => {
    return async.series([
      (next) => {
        if(!fs.existsSync(file)){
          console.log('Layout missing: %s', file);
          continuable = false;
        }
        next();
      },
      (next) => {
        if(!continuable){
          return next();
        }
        fs.readFile(file, 'utf8', (err, s) => {
          if(err){
            console.trace(err);
          }
          sHtml = s;
          next();
        });
      },
      (next) => {
        if(!continuable || !sHtml){
          return next();
        }
        sHtml = getContainer(sHtml, dir);
        next();
      },
      (next) => {
        if(!continuable || !sHtml){
          return next();
        }
        sHtml = getPartial(sHtml, dir);
        next();
      },
      (next) => {
        if(!continuable || !sHtml){
          return next();
        }

        let meta = config.meta;
        for(let k in meta){
          if(!data[k]){
            data[k] = meta[k];
          }
        }
        data.revision = config.revision;

        let template = Handlebars.compile(sHtml);
        sHtml = template(data);
        next();
      },
      (next) => {
        if(!continuable || !sHtml){
          return next();
        }
        let css = context.css || false;
        if(!css){
          return next();
        }
        lessify(css).then((href) => {
          sHtml = sHtml.replace('{@style}', '<link rel="stylesheet" type="text/css" href="' + href + '?rev=' + config.revision + '">');
        }).catch((e) => {
          console.trace(e);
        }).finally(next);
      },
      (next) => {
        if(!continuable || !sHtml){
          return next();
        }
        let js = context.js || false;
        if(!js){
          return next();
        }
        babelize(js).then((src) => {
          sHtml = sHtml.replace('{@script}', '<script type="text/javascript" src="' + src + '?rev=' + config.revision + '"></script>');
        }).catch((e) => {
          console.trace(e);
        }).finally(next);
      },
      (next) => {
        if(!continuable || !sHtml){
          return next();
        }
        let sdata = bella.hasProperty(context, 'sdata') ? context.sdata : {};
        sHtml = sHtml.replace('{@sdata}', '<script type="text/javascript">window.SDATA=' + JSON.stringify(sdata) + '</script>');
        next();
      },
      (next) => {
        if(!continuable || !sHtml){
          return next();
        }
        sHtml = sHtml.replace('{@style}', '');
        sHtml = sHtml.replace('{@script}', '');
        sHtml = sHtml.replace('{@sdata}', '');
        sHtml = removeNewLines(sHtml);
        sHtml = sHtml.replace(/\s+/gm, ' ');
        sHtml = sHtml.replace(/>\s+</gm, '><');
        next();
      }
    ], (err) => {
      if(err){
        console.trace(err);
        return reject(err);
      }
      resolve(sHtml);
    })
  });
}

var render = (template, data, context, res) => {
  build(template, data, context).then((s) => {
    if(res && !res.headersSent){
      return res.status(200).send(s);
    }
    return res.end();
  }).catch((e) => {
    console.trace(e);
    res.render500();
  });
}

export var io = (req, res, next) => {
  res.publish = function(template, data, context){
    return render(template, data, context, res);
  }
  next();
}

