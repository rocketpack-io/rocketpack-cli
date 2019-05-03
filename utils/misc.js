const fse = require('fs-extra')
const path = require('path')

const getFileIgnoreDirs = 'node_modules,dist'.split(',')
function getFilesRecursive(dir) {
    var files = [];
    fse.readdirSync(dir).map(x => {
        var p = path.join(dir, x);
        if ( fse.lstatSync(p).isDirectory() ) {
            if ( getFileIgnoreDirs.indexOf(x) < 0 ) {
                getFilesRecursive(p).map(y => files.push(y));
            }
        } else {
            files.push(p);
        }
    });
    return files;
}

module.exports = {
    getFilesRecursive
}