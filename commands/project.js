const cTable = require('console.table');
const getUserCredentials = require('../utils/credentials')
const ajax = require('../utils/ajax')

module.exports = function(program) {
    program
        .command('project-list')
        .description('Gets a list of all projects rekated to an account')
        .action(handleProjectList);

    program
        .command('project-create <project_name>')
        .description('Creates a project in the rocketpack cloud')
        .option('-d, --desc <s>', 'project description')
        .action(handleProjectCreate);

    program
        .command('project-info <projectid>')
        .action(handleProjectInfo);
}

function handleProjectList(options) {
    getUserCredentials().then(token => {
        return ajax.post(ajax.getApiUrl('cli/GetProjects'), {}, { bearer: token }).then(result => {
            console.table(result.data.projects);
        })
    })//.catch(e => console.log('Error occurred.'));
}

function handleProjectCreate(project_name, cmd) {
    getUserCredentials().then(token => {
        var postData = { name: project_name, description: cmd.desc };
        ajax.post(ajax.getApiUrl('cli/CreateProject'), postData, { bearer: token })
        .then(result => {
            if (result.data.success) {
                console.log('Project created successfully.');
                _printProjectInfoFromResult(result)
            }
        })
        .catch(e => console.log('error occurred'))
    }).catch(e => console.log('Error occurred'));
}

function handleProjectInfo(projectid) {
    getUserCredentials().then(token => {
        var postData = { projectID: projectid };
        ajax.post(ajax.getApiUrl('cli/GetProjectInfo'), postData, { bearer: token }).then(result => {
            if (result.data.success) {
                _printProjectInfoFromResult(result)
            } else {
                console.log('Error occurred.', result.data.message);
            }
        }).catch(e => console.log(e))
    }).catch(e => console.log('Error occurred'));
}


function _printProjectInfoFromResult(result) {
    var infos = Object.keys(result.data)
        .filter(x => x.startsWith('project'))
        .map(x => ({ key: x.substring(7), value: result.data[x] }));
    console.table(infos);
}