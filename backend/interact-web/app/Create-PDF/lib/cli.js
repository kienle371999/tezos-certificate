'use strict';

var fs = require('fs');
var path = require('path');
var sh = require('shelljs');
var colors = require('./helpers/colors')();

var app = require('./app');
var bootstrap = app.bootstrap;
var generator = app.generator;

var cli = module.exports = {
  init: function(courseData) {
    bootstrap.install(courseData);
    bootstrap.runDependencies();
  },

  generate: async function() {
    generator.checkIfExistsCertificates();
    
    var config = generator.getConfig();
    var slug = generator.createSlug(config.name);
    var localData = {
      locals: {
        name: config.name,
        course: config
      }
    };

    generator.generateHTML(slug, localData);
    await generator.generatePDF(slug, config.name);
  },

  removePDFCertificate(path) {
    sh.rm('-f', path);
  }
};
