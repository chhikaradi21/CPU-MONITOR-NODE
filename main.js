var express = require('express');
var cors = require('cors');
var path = require('path');
var app = express();
var fs = require("fs");
var compression = require('compression');
var os = require('os');
var osUtils = require('os-utils');


// compress all responses
app.use(compression());
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// allow cors for all

var corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};

app.get('/cpu-utilization', function(req, res){

    var data = {
        platform: osUtils.platform(),
        cpusInfo: os.cpus(),
        ramUsageOverall: Math.round(100 - osUtils.freememPercentage(), 0),
        platform: osUtils.platform()
    };

    var scb = function(cpusUsageOverall){
        data.cpusUsageOverall = cpusUsageOverall;
        res.end(JSON.stringify({success: true, data: data}));
    };
    osUtils.cpuUsage(scb);
});

var server = app.listen(80, function () {

    var host = server.address().address;
    var port = server.address().port;
    app.use(express.static('public'));
    console.log("Example app listening at http://%s:%s", host, port);

});
