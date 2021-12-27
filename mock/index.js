const Mock = require('mockjs');
const fs = require('fs');
const path = require('path');
const pathToRegexp = require('path-to-regexp');

const mockJSONPath = path.resolve(__dirname,'./mock.json1');
const mockJSRelativePath = './mock.js';
const mockJSPath = path.resolve(__dirname, mockJSRelativePath);

function getJsonFile() {
        var json = fs.readFileSync(mockJSONPath, 'utf-8');
        return JSON.parse(json);
}

const getAPIMap = () => {
    let apiMap;
    if (fs.existsSync(mockJSONPath)){
        apiMap = getJsonFile();
    } else if (fs.existsSync(mockJSPath)){
        delete require.cache[require.resolve(mockJSRelativePath)];
        apiMap = require(mockJSRelativePath);
    }
    return apiMap || {};
}

function checkParams(rewPath, schemaPath) {
    let pathArr = rewPath.split('/').slice(2);
    let pathSchemaArr = schemaPath.split(' ')[1].split('/').slice(1);
    let isOk = true;
    pathSchemaArr.map((item, i) => {
        if (item.startsWith(':')) {
            if (pathArr[i] === 'undefined' || pathArr[i] === 'null') {
                isOk = false;
            }
        }
    });
    return isOk;
}

module.exports = function(app){
    app.all('/mock/*', function (req, res) {
        const devAPIMap = getAPIMap();
        const { method } = req;
        let userPath = method + " /" + req.path.split('/').slice(2).join('/');
        const finalPath = Object.keys(devAPIMap).find(k => pathToRegexp(k).test(userPath));

        if (!checkParams(req.path, finalPath)){
            res.status(500).send('params error');
            return;
        }

        const query = req.query;
        if (devAPIMap[finalPath]) {
            let response;
            if (typeof devAPIMap[finalPath].response === 'function') {
                response = JSON.stringify(devAPIMap[finalPath].response(req, res));
            } else {
                response = JSON.stringify(devAPIMap[finalPath].response);
            }

            Object.keys(query).map(key => {
                response = response.replaceAll(`\$${key}`, query[key]);
            });

            res.json(Mock.mock(JSON.parse(response)));
        } else {
            res.status(404).send('404');
        }
    });
}