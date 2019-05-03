#!/usr/bin/env node

const program = require('commander');
const cmdRepo = require('./commands/repo')
const cmdProject = require('./commands/project')
const cmdLogin = require('./commands/login')

program
    .version('0.0.1', '-v, --version')

cmdRepo(program);
cmdLogin(program);
cmdProject(program);

program.parse(process.argv);
