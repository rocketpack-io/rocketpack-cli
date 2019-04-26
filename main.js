#!/usr/bin/env node

const program = require('commander');
const templates = require('./cmd-templates')
const handleCreate = require('./cmd-create')

program
    .command('templates [tag]')
    //.option('-r, --recursive', 'Remove recursively')
    .action(function (tag, cmd) {
        //console.log('remove ' + dir + (cmd.recursive ? ' recursively' : ''))
        templates.getTemplate(tag)
    });

program
    .command('create <name> <template>')
    .action(function (name, template, cmd) {
        var options = { name: name, template: template }
        handleCreate(options);
    });

program.parse(process.argv);

