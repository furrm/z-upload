var http = require('http')
    , sys = require('sys')
    , sio = require('socket.io');

var appName = 'socketio-over-nodejs-mike SERVER';

// Important! process.env.port is required for production.
var port = process.env.port || 5500;

var server = http.createServer(function (req, res) {
    console.log('A new request arrived with HTTP headers:\n\n' + JSON.stringify(req.headers));
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello from the ' + appName);
    res.end();
});

server.listen(port);


var io = sio.listen(server);

// ----------------------------------socket.io

var channels = {};

io.sockets.on('connection', function (socket) {
    var initiatorChannel = '';
    if (!io.isConnected)
        io.isConnected = true;

    socket.on('new-channel', function (data) {
        channels[data.channel] = data.channel;
        onNewNamespace(data.channel, data.sender);
    });

    socket.on('presence', function (channel) {
        var isChannelPresent = !! channels[channel];
        socket.emit('presence', isChannelPresent);
        if (!isChannelPresent)
            initiatorChannel = channel;
    });

    socket.on('disconnect', function (channel) {
        if (initiatorChannel)
            channels[initiatorChannel] = null;
    });
});

function onNewNamespace(channel, sender) {
    io.of('/' + channel).on('connection', function (socket) {
        if (io.isConnected) {
            io.isConnected = false;
            socket.emit('connect', true);
        }

        socket.on('message', function (data) {
            if (data.sender == sender)
                socket.broadcast.emit('message', data.data);
        });
    });
}

