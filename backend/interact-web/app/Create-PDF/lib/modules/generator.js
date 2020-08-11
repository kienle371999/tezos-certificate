'use strict';

var fs = require('fs');
var path = require('path');
var slug = require('slug');
var swig = require('swig');
var sh = require('shelljs');
var cp = require('child_process');
var phantomjs = require('phantomjs');
var rootPath = path.join(__dirname, '../../bin');
var { execFile } = require('promisify-child-process');

// ----------------------------------------------------------------------------
//  Privated Methods
// ----------------------------------------------------------------------------

async function _executePhantomScript(args) {
  var binPath = phantomjs.path;
  
  await execFile(binPath, args, { timeout: 2000 })
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

  generatePDF: async function(slug, name) {
    var script = path.join(__dirname, '../helpers/phantom.js');
    var file = path.join(this.CERTIFICATES_DIR, slug + '.html');
    var newFile = path.join(this.CERTIFICATES_DIR, slug + '.pdf');
    var args = [script, file, newFile];
    console.log("args", args)
    console.log('==========generate PDF==========');
    await _executePhantomScript(args);
    _removeHTMLFile(file);
    console.log('========== close generate PDF=========');
  },

  checkIfExistsCertificates: function() {
    var certificatesDir = rootPath + '/certificates';
  
    if (!sh.test('-e', certificatesDir)) {
      sh.mkdir(certificatesDir);
    } 
  }
};
