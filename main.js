#!/usr/bin/env node

const program = require('commander');
const templates = require('./cmd-templates')
const handleCreate = require('./cmd-create')
const cmdProject = require('./commands/project')
const cmdLogin = require('./commands/login')

program
    .version('0.0.1', '-v, --version')

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

cmdLogin(program);
cmdProject(program);

program.parse(process.argv);
