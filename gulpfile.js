/**
 * Common scenario for Gulp
 * @ndaidong at Twitter
 **/
require('babel/register');

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
gulp.task('setup', ['dir', 'packages', 'minify', 'img', 'svg', 'font', 'auth', 'tpl'], function(){
  console.log('All Gulp tasks have been executed.');
});
