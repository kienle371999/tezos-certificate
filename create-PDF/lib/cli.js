'use strict';

const fs = require('fs');
const path = require('path');
const sh = require('shelljs');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const slug = require('slug');
const rootPath = path.join(__dirname, '../bin/certificates/')
const app = require('./app');
const { resolve } = require('path');
const { rejects } = require('assert');
const bootstrap = app.bootstrap;
const generator = app.generator;
require('dotenv').config({ path: require('find-config')('.env') })

const mailOptions = (certName, email) => {
  return {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: 'Diploma of Graduation',
    html: '<p>Hello!</p><p>Congratulations, you have successfully graduated. Your diploma of graduation is attached.</p><p>Regards,</p>',
    attachments: [
      {
        path: rootPath.concat(certName)
      }
    ]
  }
};
  
const cli = module.exports = {
  init: function(courseData) {
    bootstrap.install(courseData);
    bootstrap.runDependencies();
  },

  generate: async function() {
    generator.checkIfExistsCertificates();
    
    const config = generator.getConfig();
    const slug = generator.createSlug(config.name);
    const localData = {
      locals: {
        name: config.name,
        course: config
      }
    };

    generator.generateHTML(slug, localData);
    await generator.generatePDF(slug, config.name);
  },

  sendMailCertificate: async function(params) {
    const certName = slug(params.name).toLowerCase().concat('.pdf');
    const certState = fs.existsSync(rootPath.concat(certName));

    if(certState) {
      const transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
      }));
      
      return new Promise((resolve, rejects) => {
        transporter.sendMail(mailOptions(certName, params.email), (error) => {
          if (error) {
            rejects(error)
          } else {
            this.removePDFCertificate(rootPath.concat(certName))
            resolve()
          }
        });
      })
    }
    else {
      this.sendMailCertificate(params)
    }
  },

  removePDFCertificate(path) {
    sh.rm('-f', path);
  }
};
