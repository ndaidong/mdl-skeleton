/**
 * Common scenario
 * @ndaidong at Twitter
 **/

 /* global task */

var builder = require('./app/workers/builder');

task('dir', builder.dir);
task('packages', builder.packages);
task('minify', builder.minify);
task('img', builder.img);
task('svg', builder.svg);
task('font', builder.font);
task('auth', builder.auth);
task('tpl', builder.tpl);
task('reset', builder.reset);
task('reconf', builder.reconf);
task('setup', builder.setup);
