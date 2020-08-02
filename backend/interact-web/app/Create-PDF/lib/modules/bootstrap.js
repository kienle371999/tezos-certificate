'use strict';

var fs = require('fs');
var path = require('path');
var sh = require('shelljs');
var npm = require('npm');
var rootPath = path.join(__dirname, '../../bin');

// ----------------------------------------------------------------------------
//  Private Methods
// ----------------------------------------------------------------------------

function _createMsg(msg) {
  sh.echo('   create '.done + msg);
}

// ----------------------------------------------------------------------------
//  Public Methods
// ----------------------------------------------------------------------------

var generator = module.exports = {
  install: function(data) {
    _createMsg(rootPath + '/config.json');
    JSON.stringify(data, null, 2).to(rootPath + '/config.json');
  },

  runDependencies: function() {
    var modules = ['gulp', 'gulp-connect', 'gulp-swig'];

    if (!sh.which('git')) {
      var errorMsg = 'Oops, Git isn\'t installed. Please install it!';
      console.log(errorMsg.italic.error);

      return;
    }

    npm.load(function (err) {
      if (err) {
        console.log(err);
      }

      npm.commands.install(modules, function (error, data) {
        if (error) {
          console.log(err);
        }
      });
    });
  }
};
