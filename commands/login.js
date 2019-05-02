const getUserCredentials = require('../utils/credentials')

module.exports = function(program) {
    program
        .command('login')
        .action((options) => {
            getUserCredentials(true).then(token => {
                console.log('You successfully logged in.')
            })//.catch(e => console.log('Error occurred.'));
        });
}