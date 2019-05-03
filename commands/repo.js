const fse = require('fs-extra')
const path = require('path')
const git = require("nodegit")
const S = require('string')
const cTable = require('console.table');
const ajax = require('../utils/ajax')
const utils = require('../utils/misc')

module.exports = function (program) {
    program
        .command('repo-templates [tag]')
        .action(handleTemplates);

    program
        .command('repo-clone <name> <template>')
        .description('clone a template and creates a new repository')
        .action(handleCreate);
}

function handleTemplates(tag) {
    // fetch repos from github
    ajax.get('https://api.github.com/orgs/rocketpack-io/repos').then(result => {
        var repos = result.data;
        var templateRepos = repos
            .filter(x => x.name.startsWith('template'))
            .map(x => ({ name: x.name, description: x.description, updated_at: x.updated_at }));
        // print templates
        console.log('Here is the list of available startup templates:\r\n')
        console.table(templateRepos);
    }).catch(error => {
        console.log('error occured when get templates list:', error);
    });
}

function handleCreate(name, template, cmd) {
    Promise.resolve({ name, template, cmd })
        .then(checkProjectFolderDoesNotExists)
        .then(cloneTemplateRepository)
        .then(replaceValues)
        .then(successfullFinish)
        .catch(function (err) {
            console.log('Request failed.')
        });
}

function checkProjectFolderDoesNotExists(options) {
    return new Promise(function (resolve, reject) {
        if (!fse.pathExistsSync(options.name)) {
            resolve(options);
        } else {
            console.log('A directory with the name ' + options.name + ' is already exists.');
            reject()
        }
    });
}

function cloneTemplateRepository(options) {
    var templateRepoUrl = 'https://github.com/rocketpack-io/template-' + options.template;
    var projectPath = path.resolve('./' + options.name);
    var projectPathTemp = projectPath + '_temp';
    return new Promise(function (resolve, reject) {
        console.log('Downloading repository...');
        git.Clone(templateRepoUrl, projectPathTemp).then(function (repository) {
            try {
                fse.moveSync(path.join(projectPathTemp, 'template'), projectPath);
                fse.removeSync(projectPathTemp);
                resolve(options);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        }).catch(function (err) {
            console.log('Sorry, the template does not exists.');
            reject(err);
        })
    });
}

function replaceValues(options) {
    console.log('Initializing the repository...')
    return new Promise(function (resolve, reject) {
        try {
            // create a list of all files
            var projectPath = path.resolve('./' + options.name);
            var files = utils.getFilesRecursive(projectPath);
            // render template
            var replacements = {
                'name': options.name
            };
            Promise.all(files.map(f => {
                return fse.readFile(f, 'utf-8').then(function (data) {
                    var newFileData = S(data).template(replacements, '{(', ')}').s;
                    return fse.writeFile(f, newFileData);
                })
            })).then(function () {
                resolve(options)
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

function successfullFinish(options) {
    console.log('Repository created successfully.')
}


// Helpers

