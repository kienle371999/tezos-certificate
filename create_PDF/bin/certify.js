#!/usr/bin/env node
'use strict';

var program = require('commander');
var sh = require('shelljs');
var cli = require('../lib/cli');
console.log('+++++')
var pkg = require('../package.json');

console.log('.......', program)

program
  .version(pkg.version)
  .usage('[command]')
  .command('init')
  .description('Install and bootstrap the application')
  .action(cli.init);

program
  .command('server')
  .description('Start a server to test your template')
  .action(cli.server);

program
  .command('generate')
  .option('-t, --test', 'Generate a test version')
  .option('-p, --production', 'Generate finals version')
  .action(cli.generate);

program
  .command('send')
  .description('Sent certificates via email')
  .action(cli.send);

program.parse(process.argv);
