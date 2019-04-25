#!/usr/bin/env node

const program = require('commander');
const templates = require('./cmd-templates')

program
    .command('templates [tag]')
    //.option('-r, --recursive', 'Remove recursively')
    .action(function (tag, cmd) {
        //console.log('remove ' + dir + (cmd.recursive ? ' recursively' : ''))
        templates.getTemplate(tag)
    });

program.parse(process.argv);

