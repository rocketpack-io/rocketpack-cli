const fse = require('fs-extra')
const path = require('path')
const git = require("nodegit")
const S = require('string')

module.exports = function (options) {
    Promise.resolve(options)
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
    return new Promise(function (resolve, reject) {
        try {
            // create a list of all files
            var projectPath = path.resolve('./' + options.name);
            var files = _getFilesRecursive(projectPath);
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
    console.log('Project created successfully.')
}


// Helpers

const getFileIgnoreDirs = 'node_modules,dist'.split(',')
function _getFilesRecursive(dir) {
    var files = [];
    fse.readdirSync(dir).map(x => {
        var p = path.join(dir, x);
        if ( fse.lstatSync(p).isDirectory() ) {
            if ( getFileIgnoreDirs.indexOf(x) < 0 ) {
                _getFilesRecursive(p).map(y => files.push(y));
            }
        } else {
            files.push(p);
        }
    });
    return files;
}