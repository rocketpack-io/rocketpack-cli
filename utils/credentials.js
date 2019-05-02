const path = require('path')
const fse = require('fs-extra')
const inquirer = require('inquirer')
const { getInstalledPathSync } = require('get-installed-path')
const ajax = require('./ajax')

module.exports = function getUserCredentials(overrideUserFile = false) {
    var installationpath = getInstalledPathSync('rocketpack-cli');
    var userFilePath = path.join(installationpath, '.user');
    return new Promise((resolve, reject) => {
        if (fse.existsSync(userFilePath) && !overrideUserFile) {
            var userFileContents = fse.readJSONSync(userFilePath, { encoding: 'utf8' });
            resolve(userFileContents.token)
        }
        else {
            _promptCredentials()
                .then((credentials) => ajax.post(ajax.getApiUrl('auth/getToken'), credentials))
                .then((result) => {
                    if (result.data.success) {
                        var userFileContents = { username: result.data.username, token: result.data.token };
                        fse.writeJSONSync(userFilePath, userFileContents, { encoding: 'utf8' });
                        resolve(userFileContents.token)
                    } else {
                        console.log(result.data.message);
                        reject(result.data.message)
                    }
                }).catch(e => reject(e))
        }
    })
}

const _promptCredentials = () => {
    console.log('Please enter your account credentials:')
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            { type: 'input', name: 'username', message: 'Username: ' },
            { type: 'password', name: 'password', message: 'Password: ' }
        ]).then(answers => {
            resolve(answers);
        });
    })
}
