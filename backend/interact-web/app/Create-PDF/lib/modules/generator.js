'use strict';

var fs = require('fs');
var path = require('path');
var slug = require('slug');
var swig = require('swig');
var sh = require('shelljs');
var cp = require('child_process');
var phantomjs = require('phantomjs');
var colors = require('../helpers/colors')();
var rootPath = path.join(__dirname, '../../bin');

// ----------------------------------------------------------------------------
//  Privated Methods
// ----------------------------------------------------------------------------
function _executePhantomScript(args, cbSuccess, cbError) {
  var binPath = phantomjs.path;

  cp.execFile(binPath, args, function(err, stdout, stderr) {
    if (err) {
      cbError(err);
    }
    else {
      cbSuccess();
    }
  });
}

function _removeHTMLFile(path) {
  sh.rm('-f', path);
}

// ----------------------------------------------------------------------------
//  Public Methods
// ----------------------------------------------------------------------------

var generator = module.exports = {
  CERTIFICATES_DIR: rootPath + '/certificates',

  getConfig: function() {
    return JSON.parse(fs.readFileSync(rootPath + '/config.json', 'utf-8'));
  },

  createSlug: function(name) {
    return slug(name).toLowerCase();
  },

  generateHTML: function(slug, data) {
    var filePath = path.join(this.CERTIFICATES_DIR, slug + '.html');
    var tpl = fs.readFileSync(rootPath + '/index.html', 'utf-8');
    var file = swig.render(tpl, data);

    file = file.replace(/href\=\"css/g, 'href="../css');
    file = file.replace(/src\=\"images/g, 'src="../images');
    fs.writeFileSync(filePath, file);
  },

  generatePDF: function(slug, name) {
    var script = path.join(__dirname, '../helpers/phantom.js');
    var file = path.join(this.CERTIFICATES_DIR, slug + '.html');
    var newFile = path.join(this.CERTIFICATES_DIR, slug + '.pdf');
    var args = [script, file, newFile];

    _executePhantomScript(args, function() {
      var success = 'Certificate generated successfully to ' + name;
      console.log(success.done);

      _removeHTMLFile(file);
    }, function(err) {
      console.log(err.error);
    });
  },

  checkIfExistsCertificates: function() {
    var certificatesDir = rootPath + '/certificates';
  
    if (!sh.test('-e', certificatesDir)) {
      sh.mkdir(certificatesDir);
    } else {
      sh.rm('-rf', certificatesDir);
      sh.mkdir(certificatesDir);
    }
  }
};
