require('./server');

const fs = require('fs');
const cp = require('child_process');

const build = () => run('build');
const uglify = () => run('uglify');

fs.watch('js', build);
fs.watch('public/js/main.js', uglify);

build();

function run (cmd) {
  const child = cp.spawn('npm', ['run', cmd]);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  return child;
}
