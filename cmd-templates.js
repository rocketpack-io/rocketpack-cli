const cTable = require('console.table');
const ajax = require('./utils/ajax')

module.exports = {
    getTemplate : function (tag) {
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
}