require('./server');

var cp = require('child_process');
var chokidar = require('chokidar');
var path = require('path');

var ROLLUP = 'rollup -c -f iife js/index.js -o public/js/main.js'.split(' ');
var UGLIFY = 'uglifyjs public/js/main.js -cmo public/js/main.min.js'.split(' ');

chokidar.watch(path.resolve('js/**/*.js'))
  .on('change', exec(ROLLUP));

chokidar.watch(path.resolve('public/js/main.js'))
  .on('change', exec(UGLIFY));

execNow(ROLLUP);

function exec (cmd) {
  return function () {
    var child = cp.spawn(cmd[0], cmd.slice(1));

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  }
}

function execNow (cmd) {
  exec(cmd)();
}

console.log('Watching files in js/');
console.log('');
