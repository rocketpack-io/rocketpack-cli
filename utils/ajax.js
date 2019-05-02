const axios = require('axios')
const https = require('https')

const getApiUrl = (action) => 'https://localhost:5001/' + action;

const ajax = function({ headers, bearer, ignoreHttpsValidation }) {
    var _options = {};
    var _headers = headers || {};

    if (bearer && bearer.length > 0) {
        _headers['Authorization'] = 'bearer ' + bearer;
    }

    ignoreHttpsValidation = true;
    if (ignoreHttpsValidation === true) {
        _options['httpsAgent'] = new https.Agent({  
            rejectUnauthorized: false
        })
    }

    _options['headers'] = _headers;
    return axios.create(_options)
} 

module.exports = {
    getApiUrl,
    get(url, options = {}) {
        var instance = ajax(options);
        return instance.get(url);
    },
    post(url, params, options = {}) {
        var instance = ajax(options);
        return instance.post(url, params);
    }
}