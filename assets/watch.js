require('./server');

const cp = require('child_process');
const chokidar = require('chokidar');

exec('npm', ['run', 'build-css']);
exec('npm', ['run', 'build-js']);

chokidar.watch('css/**/*.styl')
  .on('change', () => exec('npm', ['run', 'build-css']));

chokidar.watch('js/**/*.js')
  .on('change', () => exec('npm', ['run', 'build-js']));

chokidar.watch('public/js/main.js')
  .on('change', () => exec('npm', ['run', 'uglify-js']));

function exec (cmd, args) {
  const child = cp.spawn(cmd, args);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}
