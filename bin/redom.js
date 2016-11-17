#!/usr/bin/env node

var argv = process.argv;
var cwd = process.cwd();

var cp = require('child_process');
var fs = require('fs-extra');
var readline = require('readline');
var path = require('path');

var defaultName = 'redom-example';

if (argv[2]) {
  defaultName = argv[2];
}

var data = {};

flow([ intro, askName, askPath, checkPath, confirm(okBye), install, done ]);

function intro (next) {
  console.log('');
  console.log('This utility will initialize a RE:DOM project folder for you.');
  console.log('Just answer these few questions.');
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
  ask('Relative path where to init', data.name, function (_path) {
    data.path = _path;
    data.absolutepath = path.resolve(cwd, _path);
    next();
  });
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
          fs.remove(data.path, next);
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
  };
}

function okBye () {
  console.log('ok, bye!');
}

function install (next) {
  console.log('');
  console.log('Installing to ' + data.absolutepath);

  flow([makeDir, buildPackageJSON, copyJS, copyPublic, copyRollupConfig, copyServer, copyWatch, npmInstall]);

  function makeDir (cb) {
    fs.mkdirs(data.absolutepath, cb);
  }

  function buildPackageJSON (cb) {
    fs.readFile(path.resolve(__dirname, '../assets/package.json'), { encoding: 'utf8' }, function (err, file) {
      if (err) throw err;

      var json = JSON.parse(file);
      json.name = data.name;

      fs.writeFile(path.resolve(data.path, 'package.json'), JSON.stringify(json, null, 2), function (err) {
        if (err) throw err;
        cb();
      });
    });
  }

  function copyPublic (cb) {
    var source = path.resolve(__dirname, '../assets/public');
    var target = path.resolve(data.path, 'public');
    fs.copy(source, target, cb);
  }

  function copyJS (cb) {
    var source = path.resolve(__dirname, '../assets/js');
    var target = path.resolve(data.path, 'js');
    fs.copy(source, target, cb);
  }

  function copyRollupConfig (cb) {
    var source = path.resolve(__dirname, '../assets/rollup.config.js');
    var target = path.resolve(data.path, 'rollup.config.js');
    fs.copy(source, target, cb);
  }

  function copyServer (cb) {
    var source = path.resolve(__dirname, '../assets/server.js');
    var target = path.resolve(data.path, 'server.js');
    fs.copy(source, target, cb);
  }

  function copyWatch (cb) {
    var source = path.resolve(__dirname, '../assets/watch.js');
    var target = path.resolve(data.path, 'watch.js');
    fs.copy(source, target, cb);
  }

  function npmInstall () {
    console.log('Running npm install...');
    exec('npm', ['install'], { cwd: path.resolve(cwd, data.path) }, function (err) {
      if (err) {
        console.log('');
        console.log('For some reason calling npm install failed on your machine.');
        console.log("Don't worry, you can do it manually, just follow the instructions.");
        data.npmfailed = true;
        next();
      } else {
        next();
      }
    });
  }
}

function done () {
  console.log('');
  console.log('All done!');
  console.log('Now just type:');
  console.log('');
  console.log('cd ' + data.path);
  if (data.npmfailed) { console.log('npm install'); }
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
    cb && cb(err);
  });

  child.on('exit', function () {
    cb && cb();
  });
}
