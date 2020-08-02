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
    //bootstrap.runDependencies();
  },

  generate: function() {
    generator.checkIfExistsCertificates();
    console.log('Waiting, generating certificates...'.notice);

    var config = generator.getConfig();
    var slug = generator.createSlug(config.name);
    var localData = {
      locals: {
        name: config.name,
        course: config
      }
    };

    generator.generateHTML(slug, localData);
    generator.generatePDF(slug, config.name);
  },

  send: function(opts) {
    // send certificates via email using nodemailer
  }
};
