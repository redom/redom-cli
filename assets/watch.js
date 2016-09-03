require('./server');

var cp = require('child_process');
var chokidar = require('chokidar');

chokidar.watch('js/**/*.js')
  .on('change', run('build-js'));

chokidar.watch('public/js/main.js')
  .on('change', run('uglify-js'));

run('build-js')();

function run (script) {
  return function () {
    exec('npm', ['run', script]);
  }
}

function exec () {
  var args = new Array(arguments.length);

  for (var i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }

  var child = cp.spawn.apply(cp, args);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}
