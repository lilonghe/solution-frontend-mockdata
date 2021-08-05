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
            const finalPath = method + " /" + req.originalUrl.split('/').slice(2).join('/').split("?")[0];

            if (devAPIMap[finalPath]) {
                let response = devAPIMap[finalPath].response || devAPIMap[finalPath];
                res.json(Mock.mock(response));
            } else {
                res.text('404');
            }
        });
    });
}