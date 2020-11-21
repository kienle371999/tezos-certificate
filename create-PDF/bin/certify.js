'use strict';

var program = require('commander');
var cli = require('../lib/cli');

console.log('.......', program)

program.action(cli.generate);
program.parse(process.argv);
