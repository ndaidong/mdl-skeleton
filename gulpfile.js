/**
 * Common scenario for Gulp
 * @ndaidong at Twitter
 **/

 /* eslint no-console: 0*/

'use strict'; // enable strict mode to use "let" in node.js 4.x

var builder = require('./app/workers/builder');

var gulp = require('gulp');

gulp.task('dir', builder.dir);
gulp.task('packages', builder.packages);
gulp.task('minify', builder.minify);
gulp.task('img', builder.img);
gulp.task('svg', builder.svg);
gulp.task('font', builder.font);
gulp.task('auth', builder.auth);
gulp.task('tpl', builder.tpl);
gulp.task('reset', builder.reset);
gulp.task('reconf', builder.reconf);
gulp.task('setup', [ 'dir', 'packages', 'minify', 'img', 'svg', 'font', 'auth', 'tpl', 'reconf' ], () => {
  console.log('All Gulp tasks have been executed.');
});
