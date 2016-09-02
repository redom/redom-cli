#!/usr/bin/env node

var argv = process.argv;
var cwd = process.cwd();

var cp = require('child_process');
var fs = require('fs');
var readline = require('readline');

var defaultName = 'redom-example';

if (argv[2]) {
  defaultName = argv[2];
}

var data = {};

flow([ intro, askName, askPath, checkPath, confirm(okBye), install, done ]);

function intro (next) {
  console.log('');
  console.log('This utility will initialize a RE:DOM project folder for you.')
  console.log('Please answer some questions so we can start making DOM great again!');
  console.log('');
  next();
}

function askName (next) {
  ask('Name of the project', defaultName, function (name) {
    data.name = name;
    next();
  });
}

function askPath (next) {
  ask('Relative path where to init', data.name, function (path) {
    data.path = path;
    data.absolutepath = cwd + '/' + path;
    next();
  })
}

function checkPath (next) {
  console.log('');
  console.log('Install path: "' + data.absolutepath + '"...');
  fs.exists(data.absolutepath, function (exists) {
    data.exists = exists;
    next();
  });
}

function confirm (cancel) {
  return function (next) {
    if (data.exists) {
      console.log('');
      console.log('Path already exists!');
      ask('Are you sure you want to replace the existing path?', 'n', function (answer) {
        if (answer === 'y' || answer === 'Y') {
          exec('rm', ['-r', data.path], next);
        } else {
          cancel();
        }
      });
    } else {
      ask('Ready to install?', 'y', function (answer) {
        if (answer === 'y' || answer === 'Y') {
          next();
        } else {
          cancel();
        }
      });
    }
  }
}

function okBye () {
  console.log('ok, bye!')
}

function install (next) {
  console.log('');
  console.log('Installing to ' + data.absolutepath);

  flow([makeDir, buildPackageJSON, copyJS, copyPublic, copyRollupConfig, copyServer, copyWatch, npmInstall]);

  function makeDir (cb) {
    exec('mkdir', ['-p', data.path], cb);
  }

  function buildPackageJSON (cb) {
    fs.readFile('assets/package.json', { encoding: 'utf8' }, function (err, file) {
      if (err) throw err;

      var json = JSON.parse(file);
      json.name = data.name;

      fs.writeFile(data.path + '/package.json', JSON.stringify(json, null, 2), function (err) {
        if (err) throw err;
        cb();
      });
    });
  }

  function copyPublic (cb) {
    exec('cp', ['-r', 'assets/public', data.path + '/public'], cb);
  }

  function copyJS (cb) {
    exec('cp', ['-r', 'assets/js', data.path + '/js'], cb);
  }

  function copyRollupConfig (cb) {
    exec('cp', ['-r', 'assets/rollup.config.js', data.path + '/rollup.config.js'], cb);
  }

  function copyServer (cb) {
    exec('cp', ['assets/server.js', data.path + '/server.js'], cb);
  }

  function copyWatch (cb) {
    exec('cp', ['assets/watch.js', data.path + '/watch.js'], cb);
  }

  function npmInstall () {
    console.log('Running npm install...');
    exec('npm', ['install'], { cwd: cwd + '/' + data.path }, next);
  }
}

function done () {
  console.log('');
  console.log('All done!');
  console.log('Now just type:');
  console.log('');
  console.log('cd ' + data.path);
  console.log('npm run dev');
  console.log('');
  console.log("And you're ready to start developing!");
}

function flow (actions) {
  var action = actions.shift();

  action(function (err) {
    if (err) {
      throw err;
    }
    if (actions.length) {
      flow(actions);
    }
  });
}

function ask (str, defaultValue, cb) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question(str + ': (' + defaultValue + ') ', function (answer) {
    rl.close();

    if (answer) {
      cb(answer);
    } else {
      cb(defaultValue);
    }
  });
}

function exec () {
  var args = new Array(arguments.length);

  for (var i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }

  var cb = args.pop();

  var child = cp.spawn.apply(cp, args);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('error', function (err) {
    throw err;
  });

  child.on('exit', function () {
    cb && cb();
  });
}
