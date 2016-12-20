/**
 * Common scenario for setting up and optimizing system
 * @ndaidong
 **/

var fs = require('fs');
var path = require('path');
var exec = require('child_process').execSync;

var bella = require('bellajs');
var mkdirp = require('mkdirp').sync;
var cpdir = require('copy-dir').sync;
var readdir = require('recursive-readdir');

var SVGO = require('svgo');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');

var debug = require('debug');
var info = debug('compiler:info');
var error = debug('compiler:error');

var compiler = require('./compiler');

var fixPath = compiler.fixPath;

var pkg = require('../../package');
var bconf = pkg.builder || {};
var jsDir = fixPath(bconf.jsDir);
var cssDir = fixPath(bconf.cssDir);
var imgDir = fixPath(bconf.imgDir);
var authDir = fixPath(bconf.authDir);
var fontDir = fixPath(bconf.fontDir);
var distDir = fixPath(bconf.distDir);
var vendorDir = fixPath(bconf.vendorDir);
var tplDir = fixPath(bconf.tplDir);

var js3rdDir = fixPath(jsDir + vendorDir);
var css3rdDir = fixPath(cssDir + vendorDir);

var download = (src, saveas) => {
  if (fs.existsSync(saveas)) {
    fs.unlink(saveas);
  }
  info('Downloading %s ...', src);
  exec('wget -O ' + saveas + ' ' + src);
  info('Downloaded %s', saveas);
};

var createDir = (ls) => {
  if (bella.isArray(ls)) {
    ls.forEach((d) => {
      d = path.normalize(d);
      if (!fs.existsSync(d)) {
        mkdirp(d);
        info('Created dir "%s"... ', d);
      }
    });
  } else {
    ls = path.normalize(ls);
    if (!fs.existsSync(ls)) {
      mkdirp(ls);
    }
  }
};

var removeDir = (ls) => {
  if (bella.isArray(ls)) {
    let k = 0;
    ls.forEach((d) => {
      d = path.normalize(d);
      exec('rm -rf ' + d);
      ++k;
      info('%s, removed dir "%s"... ', k, d);
    });
  } else {
    ls = path.normalize(ls);
    exec('rm -rf ' + ls);
  }
  info('Done.');
};

var copyDir = (from, to) => {
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

var copyFile = (source, target) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
    }
    let rd = fs.createReadStream(source);
    rd.on('error', reject);
    let wr = fs.createWriteStream(target);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  });
};

var createEmptyFile = (dest) => {
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

var publish = (from, to) => {
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

var minify = () => {
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
          let minified = compiler.jsminify(s);
          fs.writeFileSync(min, minified, 'utf8');
          info('Minified: %s', dest);
        } else {
          fs.unlinkSync(dest);
          missed.push(dest);
        }
      }
    }
    if (missed.length > 0) {
      info('Missing the following files:');
      info(missed);
    }
  }
  return null;
};

var img = () => {
  publish(imgDir, distDir + '/images/');
};
var font = () => {
  publish(fontDir, distDir + '/fonts/');
};

var auth = () => {
  publish(authDir, distDir + '/auth/');
};

var tpl = () => {
  publish(tplDir, distDir + '/templates/');
};

var reset = () => {
  removeDir(distDir);
  removeDir(fixPath(jsDir + vendorDir));
  removeDir(fixPath(cssDir + vendorDir));
};

var svg = () => {

  let svgo = new SVGO();

  let minsvg = (file) => {
    let s = fs.readFileSync(file, 'utf8');
    svgo.optimize(s, (result) => {
      let ss = result.data;
      fs.writeFileSync(file, ss, 'utf8');
    });
  };

  let minimg = (file) => {
    imagemin([file], {
      plugins: [
        imageminMozjpeg({targa: false}),
        imageminPngquant({quality: '65-80'})
      ]
    }).then((ls) => {
      ls.forEach((item) => {
        if (item && item.data) {
          fs.writeFile(file, item.data, (er) => {
            if (er) {
              error(er);
            }
          });
        }
      });
    }).catch((e) => {
      error(e);
    });
  };

  let rdir = fixPath(distDir + '/images');
  readdir(rdir, (err, files) => {
    if (err) {
      error(err);
    }
    if (files && files.length) {
      files.forEach((f) => {
        let b = path.extname(f);
        if (b === '.svg') {
          minsvg(f);
        } else if (b === '.jpg' || b === '.jpeg' || b === '.png') {
          minimg(f);
        }
      });
    }
  });
};

var packages = () => {
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

var reconf = () => {
  let saveas = js3rdDir + 'reconf.js';
  let dirs = bconf.directories || [];
  if (bella.isArray(dirs) && dirs.length) {
    dirs.map((d) => {
      if (!fs.existsSync(d)) {
        mkdirp(d);
      }
      return null;
    });
  }

  let c = {
    urlArgs: 'rev=' + bella.id,
    baseUrl: '/js/',
    paths: {}
  };

  let paths = {};
  let files = bconf.javascript || {};
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
  info('Packages are ready to use.');
  return null;
};

var dir = () => {
  let dirs = bconf.directories || [];
  dirs = dirs.concat([
    distDir + '/js',
    distDir + '/css'
  ]);
  createDir(dirs);
  return null;
};

var setup = () => {
  info('Start building...');
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

module.exports = {
  dir,
  download,
  removeDir,
  createDir,
  copyDir,
  copyFile,
  createEmptyFile,
  publish,
  minify,
  reset,
  fixPath,
  auth,
  font,
  tpl,
  img,
  svg,
  packages,
  reconf,
  setup
};
