'use strict';

var fs = require('fs');
var path = require('path');
var sh = require('shelljs');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const slug = require('slug');
const rootPath = path.join(__dirname, '../bin/certificates/')

var app = require('./app');
var bootstrap = app.bootstrap;
var generator = app.generator;

const transporter = nodemailer.createTransport(smtpTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
}));
  
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

  sendMailCertificate: async function(params) {
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: params.email,
      html: '<p>Hello!</p><p>Congratulations, you have successfully graduated. Your diploma of graduation is attached.</p><p>Regards,</p>',
      subject: 'Diploma of Graduation',
      attachments: [
        {
          path: rootPath.concat(certName)
        }
      ]
    };
    const certName = slug(params.name).toLowerCase();
    const certState = fs.existsSync(rootPath.concat(certName))

    if(certState) {
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
         console.log("error", error)
         throw new Error(error)
        } else {
          console.log('Success')
        }
      });
    }
    else {
      this.sendMailCertificate(params)
    }
  },

  removePDFCertificate(path) {
    sh.rm('-f', path);
  }
};
