/**
 * Common scenario for setting up and optimizing system
 * @ndaidong
 **/

var fs = require('fs');
var path = require('path');
var exec = require('child_process').execSync;

var traceur = require('traceur/src/node/api.js');
var bella = require('bellajs');
var mkdirp = require('mkdirp').sync;
var cpdir = require('copy-dir').sync;
var readdir = require('recursive-readdir');

var UglifyJS = require('uglify-js');
var SVGO = require('svgo');

var fixPath = (p) => {
  return p ? (p += p.endsWith('/') ? '' : '/') : p;
}

var pkg = require('../../package');
var bconf = pkg.builder || {},
  jsDir = fixPath(bconf.jsDir),
  imgDir = fixPath(bconf.imgDir),
  authDir = fixPath(bconf.authDir),
  fontDir = fixPath(bconf.fontDir),
  distDir = fixPath(bconf.distDir),
  tplDir = fixPath(bconf.tplDir);

export var download = (src, saveas) => {
  if(fs.existsSync(saveas)){
    fs.unlink(saveas);
  }
  console.log('Downloading %s ...', src);
  exec('wget -O ' + saveas + ' ' + src);
  console.log('Downloaded %s', saveas);
}

export var createDir = (ls) => {
  if(bella.isArray(ls)){
    ls.forEach((d) => {
      d = path.normalize(d);
      if(!fs.existsSync(d)){
        mkdirp(d);
        console.log('Created dir "%s"... ', d);
      }
    });
  }
  else{
    ls = path.normalize(ls);
    if(!fs.existsSync(ls)){
      mkdirp(ls);
    }
  }
}

export var removeDir = (ls) => {
  if(bella.isArray(ls)){
    let k = 0;
    ls.forEach((d) => {
      d = path.normalize(d);
      exec('rm -rf ' + d);
      ++k;
      console.log('%s, removed dir "%s"... ', k, d);
    });
  }
  else{
    ls = path.normalize(ls);
    exec('rm -rf ' + ls);
  }
  console.log('Done.');
}

export var createEmptyFile = (dest) => {
  let ext = path.extname(dest);
  let fname = path.basename(dest);
  let content = '';
  if(ext === '.js'){
    content = '/**' + fname + '*/';
  }
  else if(ext === '.css' || ext === '.less'){
    content = '/*' + fname + '*/';
  }
  fs.writeFileSync(dest, content, {encoding: 'utf8'});
}

export var publish = (from, to) => {
  if(!fs.existsSync(from)){
    return false;
  }
  if(fs.existsSync(to)){
    exec('rm -rf ' + to);
  }
  mkdirp(to);
  cpdir(from, to);
}

export var minify = () => {
  let dir = jsDir + '/packages/';
  let files = bconf.files || {};
  if(bella.isObject(files)){
    let destDir = dir;
    let rd = fixPath(destDir);
    let missed = [];
    for(let alias in files){
      let dest = rd + alias + '.js';
      let min = rd + alias + '.min.js';
      if(fs.existsSync(dest) && !fs.existsSync(min)){
        let s = fs.readFileSync(dest, 'utf8');
        if(s && s.length > 0){
          let minified = UglifyJS.minify(s, {fromString: true});
          fs.writeFileSync(min, minified.code, 'utf8');
          console.log('Minified: %s', dest);
        }
        else{
          fs.unlinkSync(dest);
          missed.push(dest);
        }
      }
    }
    if(missed.length > 0){
      console.log('Missing the following files:')
      console.log(missed);
    }
  }
}

export var img = () => {
  publish(imgDir, distDir + '/images/');
}
export var font = () => {
  publish(fontDir, distDir + '/fonts/');
}

export var auth = () => {
  publish(authDir, distDir + '/auth/');
}


export var tpl = () => {
  publish(tplDir, distDir + '/templates/');
}

export var reset = () => {
  removeDir(distDir);
  removeDir(jsDir + '/packages/');
}

export var svg = () => {
  let svgo = new SVGO();
  let minsvg = (file) => {
    let s = fs.readFileSync(file, 'utf8');
    svgo.optimize(s, (result) => {
      let ss = result.data;
      fs.writeFileSync(file, ss, 'utf8');
    });
  }

  readdir(distDir + 'images/', ['*.png', '*.jpg', '*.gif', '.ico'], (err, files) => {
    if(err){
      console.trace(err);
    }
    if(files && files.length){
      files.forEach((f) => {
        let b = path.extname(f);
        if(b === '.svg'){
          minsvg(f);
        }
      });
    }
  });
}

export var packages = () => {
  let files = bconf.files || {};
  if(bella.isObject(files)){
    let destDir = jsDir + 'packages/';
    let rd = fixPath(destDir);
    if(!fs.existsSync(rd)){
      mkdirp(rd);
    }
    for(let alias in files){
      let src = files[alias];
      let dest = rd + alias + '.js';
      if(!fs.existsSync(dest)){
        download(src, dest);
      }
    }
  }
}

export var reconf = () => {
  let saveas = jsDir + '/packages/reconf.js';
  let dirs = bconf.directories || [];
  if(bella.isArray(dirs) && dirs.length){
    dirs.map((d) => {
      if(!fs.existsSync(d)){
        mkdirp(d);
      }
    });
  }

  let c = {
    urlArgs: 'rev=' + bella.id,
    baseUrl: '/js/',
    paths: {}
  }

  let paths = {};
  let files = bconf.files || {};
  if(bella.isObject(files)){
    let destDir = jsDir + 'packages/';
    let rd = fixPath(destDir);
    for(let alias in files){
      let dest = rd + alias + '.min.js';
      if(!fs.existsSync(dest)){
        dest = rd + alias + '.js';
      }
      if(fs.existsSync(dest)){
        let b = path.extname(dest);
        if(b === '.js'){
          let a = path.basename(dest, b);
          paths[alias] = 'packages/' + a;
        }
      }
    }
  }
  let collect = (folder, to) => {
    let dir = jsDir + folder;
    if(!fs.existsSync(dir)){
      createDir(dir);
      return false;
    }
    fs.readdirSync(dir).forEach((f) => {
      let bx = path.extname(f);
      if(bx === '.js'){
        let ax = path.basename(f, bx);
        to[ax] = folder + '/' + ax;
      }
    });
  }

  collect('modules', paths);
  c.paths = paths;
  fs.writeFileSync(saveas, ';var RECONF=' + JSON.stringify(c) + ';');
  console.log('Packages are ready to use.');
}

export var transpile = (req, res, next) => {
  if(/\.*\/modules\/[A-Za-z0-9-_]+\.js/.test(req.url)){
    let f = 'assets' + req.url;
    if(fs.existsSync(f)){
      let s = fs.readFileSync(f);
      let c = traceur.compile(s);
      res.setHeader('content-type', 'text/javascript');
      res.status(200).send(c);
    }
  }
  next();
}

export var dir = () => {
  let dirs = bconf.directories || [];
  dirs = dirs.concat([
    distDir + '/js',
    distDir + '/css'
  ]);
  createDir(dirs);
}

export var setup = () => {
  console.log('Start building...');
  dir();
  img();
  svg();
  font();
  auth();
  tpl();
  packages();
  minify();
  reconf();
}
