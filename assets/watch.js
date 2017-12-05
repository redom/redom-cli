require('./server');

const cp = require('child_process');
const fs = require('fs');

const isWindows = require('process').platform === 'win32';
const npm = isWindows ? 'npm.cmd' : 'npm';

const utf8 = { encoding: 'utf8' };

const buildCSS = () => run('build-css', true); // run forever
const buildJS = () => run('build-js', true); // run forever

setTimeout(() => {
  buildCSS();
  buildJS();
}, 1000);

fs.watch('public/js/main.js', () => {
  fs.readFile('public/js/main.js', utf8, (err, src) => {
    if (err) {
      throw new Error(err);
    }
    fs.writeFile('public/js/main.min.js', src.split('\n')[0], utf8, (err) => {
      if (err) {
        throw new Error(err);
      }
      console.log('Written public/js/main.min.js');
    });
  });
});

function run (cmd, forever) {
  const child = cp.spawn(npm, ['run', cmd]);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  if (forever) {
    child.on('exit', () => {
      setTimeout(run, 5000, cmd, true);
    });
  }

  return child;
}
