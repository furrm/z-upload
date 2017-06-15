/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
var errorHandler = require('./routes/utils/errorHandler')();
var favicon = require('serve-favicon');
var fileServer = require('serve-static');
var http = require('http');
var logger = require('morgan');
var port = process.env.PORT || 3001;
var routes;
var server;

var environment = process.env.NODE_ENV;
var oneDay = 86400000;
var pkg = require('./../../package.json');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
routes = require('./routes/index')(app);
app.use(compress());            // Compress response data with gzip
app.use(logger('dev'));         // logger
app.use(favicon(__dirname + '/favicon.ico'));
app.use(fileServer(__dirname + '/../../'));    // Support static file content
app.use(cors());                // enable ALL CORS requests
app.use(errorHandler.init);

console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

if (environment === 'stage') {
    console.log('** STAGE **');
    app.use('/', express.static('./build/stage/'));
} else {
    console.log('** DEV **');
    app.use('/', express.static(pkg.paths.client, { maxAge: oneDay }));
    app.use('/', express.static('./', { maxAge: oneDay }));

    app.get('/ping', function (req, res, next) {
        console.log(req.body);
        res.send('pong');
    });
}

server = http.createServer(app);

server.listen(port, function () {
    console.log('************************');
    console.log('Code Camper MEAN Server');
    console.log('Listening on port ' + port);
    console.log('\nRemember to first start MongoDb server');
    console.log('************************\n');
    console.log('env = ' + app.get('env') +
        '\nport = ' + port +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd() = ' + process.cwd());
});
