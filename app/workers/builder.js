/**
 * Common scenario for setting up and optimizing system
 * @ndaidong
 **/

/* eslint no-console: 0*/

var fs = require('fs');
var path = require('path');
var exec = require('child_process').execSync;

var bella = require('bellajs');
var mkdirp = require('mkdirp').sync;
var cpdir = require('copy-dir').sync;
var readdir = require('recursive-readdir');

var UglifyJS = require('uglify-js');
var SVGO = require('svgo');

var fixPath = (p) => {
  if (!p) {
    return '';
  }
  p = path.normalize(p);
  p += p.endsWith('/') ? '' : '/';
  return p;
};

var pkg = require('../../package');
var bconf = pkg.builder || {},
  jsDir = fixPath(bconf.jsDir),
  cssDir = fixPath(bconf.cssDir),
  imgDir = fixPath(bconf.imgDir),
  authDir = fixPath(bconf.authDir),
  fontDir = fixPath(bconf.fontDir),
  distDir = fixPath(bconf.distDir),
  vendorDir = fixPath(bconf.vendorDir),
  tplDir = fixPath(bconf.tplDir);

var js3rdDir = fixPath(jsDir + vendorDir);
var css3rdDir = fixPath(cssDir + vendorDir);

export var download = (src, saveas) => {
  if (fs.existsSync(saveas)) {
    fs.unlink(saveas);
  }
  console.log('Downloading %s ...', src);
  exec('wget -O ' + saveas + ' ' + src);
  console.log('Downloaded %s', saveas);
};

export var createDir = (ls) => {
  if (bella.isArray(ls)) {
    ls.forEach((d) => {
      d = path.normalize(d);
      if (!fs.existsSync(d)) {
        mkdirp(d);
        console.log('Created dir "%s"... ', d);
      }
    });
  } else {
    ls = path.normalize(ls);
    if (!fs.existsSync(ls)) {
      mkdirp(ls);
    }
  }
};

export var removeDir = (ls) => {
  if (bella.isArray(ls)) {
    let k = 0;
    ls.forEach((d) => {
      d = path.normalize(d);
      exec('rm -rf ' + d);
      ++k;
      console.log('%s, removed dir "%s"... ', k, d);
    });
  } else {
    ls = path.normalize(ls);
    exec('rm -rf ' + ls);
  }
  console.log('Done.');
};

export var copyDir = (from, to) => {
  if (!fs.existsSync(from)) {
    return false;
  }
  if (fs.existsSync(to)) {
    exec('rm -rf ' + to);
  }
  mkdirp(to);
  cpdir(from, to);
  return false;
};

export var copyFile = (source, target) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
    }
    var rd = fs.createReadStream(source);
    rd.on('error', reject);
    var wr = fs.createWriteStream(target);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  });
};

export var createEmptyFile = (dest) => {
  let ext = path.extname(dest);
  let fname = path.basename(dest);
  let content = '';
  if (ext === '.js') {
    content = '/**' + fname + '*/';
  } else if (ext === '.css' || ext === '.less') {
    content = '/*' + fname + '*/';
  }
  fs.writeFileSync(dest, content, {
    encoding: 'utf8'
  });
};

export var publish = (from, to) => {
  if (!fs.existsSync(from)) {
    return false;
  }
  if (fs.existsSync(to)) {
    exec('rm -rf ' + to);
  }
  mkdirp(to);
  cpdir(from, to);
  return null;
};

export var minify = () => {
  let files = bconf.javascript || {};
  if (bella.isObject(files)) {
    let missed = [];
    for (let alias in files) {
      if (!bella.hasProperty(files, alias)) {
        return false;
      }
      let dest = js3rdDir + alias + '.js';
      let min = js3rdDir + alias + '.min.js';
      if (fs.existsSync(dest) && !fs.existsSync(min)) {
        let s = fs.readFileSync(dest, 'utf8');
        if (s && s.length > 0) {
          let minified = UglifyJS.minify(s, {
            fromString: true
          });
          fs.writeFileSync(min, minified.code, 'utf8');
          console.log('Minified: %s', dest);
        } else {
          fs.unlinkSync(dest);
          missed.push(dest);
        }
      }
    }
    if (missed.length > 0) {
      console.log('Missing the following files:');
      console.log(missed);
    }
  }
  return null;
};

export var img = () => {
  publish(imgDir, distDir + '/images/');
};
export var font = () => {
  publish(fontDir, distDir + '/fonts/');
};

export var auth = () => {
  publish(authDir, distDir + '/auth/');
};

export var tpl = () => {
  publish(tplDir, distDir + '/templates/');
};

export var reset = () => {
  removeDir(distDir);
  removeDir(fixPath(jsDir + vendorDir));
  removeDir(fixPath(cssDir + vendorDir));
};

export var svg = () => {
  let svgo = new SVGO();
  let minsvg = (file) => {
    let s = fs.readFileSync(file, 'utf8');
    svgo.optimize(s, (result) => {
      let ss = result.data;
      fs.writeFileSync(file, ss, 'utf8');
    });
  };

  return readdir(distDir + 'images/', [ '*.png', '*.jpg', '*.gif', '.ico' ], (err, files) => {
    if (err) {
      console.trace(err);
    }
    if (files && files.length) {
      files.forEach((f) => {
        let b = path.extname(f);
        if (b === '.svg') {
          minsvg(f);
        }
      });
    }
  });
};

export var packages = () => {
  let jsFiles = bconf.javascript || {};
  let cssFiles = bconf.css || {};
  if (bella.isObject(jsFiles)) {
    let rd = fixPath(js3rdDir);
    if (!fs.existsSync(rd)) {
      mkdirp(rd);
    }
    for (let alias in jsFiles) {
      if (bella.hasProperty(jsFiles, alias)) {
        let src = jsFiles[alias];
        let dest = rd + alias + '.js';
        if (!fs.existsSync(dest)) {
          download(src, dest);
        }
      }
    }
  }
  if (bella.isObject(cssFiles)) {
    let rd = fixPath(css3rdDir);
    if (!fs.existsSync(rd)) {
      mkdirp(rd);
    }
    for (let alias in cssFiles) {
      if (bella.hasProperty(cssFiles, alias)) {
        let src = cssFiles[alias];
        let dest = rd + alias + '.css';
        if (!fs.existsSync(dest)) {
          download(src, dest);
        }
      }
    }
  }
};

export var reconf = () => {
  let saveas = js3rdDir + 'reconf.js';
  let dirs = bconf.directories || [];
  if (bella.isArray(dirs) && dirs.length) {
    dirs.map((d) => {
      if (!fs.existsSync(d)) {
        mkdirp(d);
      }
    });
  }

  let c = {
    urlArgs: 'rev=' + bella.id,
    baseUrl: '/js/',
    paths: {}
  };

  let paths = {};
  let files = bconf.files || {};
  if (bella.isObject(files)) {
    for (let alias in files) {
      if (!bella.hasProperty(files, alias)) {
        return false;
      }
      let dest = js3rdDir + alias + '.min.js';
      if (!fs.existsSync(dest)) {
        dest = js3rdDir + alias + '.js';
      }
      if (fs.existsSync(dest)) {
        let b = path.extname(dest);
        if (b === '.js') {
          let a = path.basename(dest, b);
          paths[alias] = vendorDir + a;
        }
      }
    }
  }
  let collect = (folder, to) => {
    let dir = jsDir + folder;
    if (!fs.existsSync(dir)) {
      createDir(dir);
      return false;
    }
    fs.readdirSync(dir).forEach((f) => {
      let bx = path.extname(f);
      if (bx === '.js') {
        let ax = path.basename(f, bx);
        to[ax] = folder + '/' + ax;
      }
    });
    return null;
  };

  collect('modules', paths);
  c.paths = paths;
  fs.writeFileSync(saveas, ';var RECONF=window.RECONF=' + JSON.stringify(c) + ';');
  console.log('Packages are ready to use.');
  return null;
};

export var dir = () => {
  let dirs = bconf.directories || [];
  dirs = dirs.concat([
    distDir + '/js',
    distDir + '/css'
  ]);
  createDir(dirs);
  return null;
};

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
};
