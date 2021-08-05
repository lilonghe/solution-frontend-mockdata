const Mock = require('mockjs');
const fs = require('fs');
const path = require('path');

function getJsonFile(filePath) {
    var json = fs.readFileSync(path.resolve(__dirname,filePath), 'utf-8');
    return JSON.parse(json);
}

module.exports = function(app){
    var apiMap = getJsonFile('./mock.json');
    Object.keys(apiMap).map(path => {
        app.all('/mock/*', function (req, res) {
            var devAPIMap = getJsonFile('./mock.json');
            const { method } = req;
            const finalPath = method + " /" + req.path.split('/').slice(2).join('/');
            const query = req.query;
            if (devAPIMap[finalPath]) {
                let response = JSON.stringify(devAPIMap[finalPath].response || devAPIMap[finalPath]);

                Object.keys(query).map(key => {
                    response = response.replaceAll(`\$${key}`, query[key]);
                });

                res.json(Mock.mock(JSON.parse(response)));
            } else {
                res.send('404');
            }
        });
    });
}