var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');

var server = http.createServer(function(req, res) {

}).listen(8080, function() {
        console.log('Listening at: http://localhost:8080');
    });


var chat = server
    .of('/chat')
    .on('connection', function (socket) {
        socket.emit('a message', {
            that: 'only'
            , '/chat': 'will get'
        });
        chat.emit('a message', {
            everyone: 'in'
            , '/chat': 'will get'
        });
    });

//socketio.listen(server).on('connection', function (socket) {
//    socket.on('message', function (msg) {
//        console.log('Message Received: ', msg);
//        socket.broadcast.emit('message', msg);
//    });
//});