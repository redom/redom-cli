require('./server');

var path = require('path');
var fs = require('fs');

var chokidar = require('chokidar');
var rollup = require('rollup').rollup;
var buble = require('rollup-plugin-buble');
var nodeResolve = require('rollup-plugin-node-resolve');
var uglifyjs = require('uglify-js');

chokidar.watch(path.resolve('js/**/*.js')).on('change', buildJS);
chokidar.watch(path.resolve('public/js/main.js')).on('change', uglifyJS);

buildJS();

function buildJS () {
  rollup({
    entry: 'js/index.js',
    plugins: [
      buble(),
      nodeResolve({
        main: true,
        jsnext: true
      })
    ]
  }).then(function (bundle) {
    bundle.write({
      format: 'iife',
      dest: 'public/js/main.js'
    });
  });
}

function uglifyJS () {
  var result = uglifyjs.minify('public/js/main.js');
  fs.writeFile(path.resolve('public/js/main.min.js'), result.code, { encoding: 'utf8' }, function (err) {
    if (err) console.error(err);
  });
}

console.log('Watching files in js/');
console.log('');
