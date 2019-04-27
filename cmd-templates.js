const request = require('request');
const cTable = require('console.table');

module.exports = {
    getTemplate : function (tag) {
        var options = {
            url: 'https://api.github.com/orgs/rocketpack-io/repos',
            headers: {
                'User-Agent': 'rocketpack-cli'
            }
        };
        // fetch repos from github
        request(options, function (error, response, body) {
            if (response && response.statusCode === 200) {
                var repos = JSON.parse(body);
                var templateRepos = repos
                    .filter(x => x.name.startsWith('template'))
                    .map(x => ({ name: x.name, description: x.description, updated_at: x.updated_at }));
                // print templates
                console.log('Here is the list of available startup templates:\r\n')
                console.table(templateRepos);
            } else {
                console.log('error occured when get templates list:', error);
            }
        });
    }
}