//require.paths.unshift(__dirname + "/vendor");

//var http = require('http'),
//    sys = require('sys'),
//    nodeStatic = require('node-static/lib/node-static');

var http = require('http')
    , sys = require('sys')
    , sio = require('socket.io');

var port = process.env.port || 1337;

//http.createServer(function (req, res) {
//    var file = new nodeStatic.server('./public', {
//        cache:false
//    });
//
//    req.addListener('end',function(){
//
//    });
//
//}).listen(1337, '127.0.0.1');
//console.log('Server running at http://127.0.0.1:1337/');


var server = http.createServer(function (req, res) {
    console.log('A new request arrived with HTTP headers:\n\n' + JSON.stringify(req.headers));
    res.writeHead(200, {'Content-Type': 'text/plain'});
//    res.write(sys.inspect(req)); // Prints out the contents of the request
    console.log('This is a log!! ' + Date.now());
    res.end('Hello Again with sockets');

    res.end();
});

server.listen(port);


/**
 * Socket.IO server (single process only)
 */

var io = sio.listen(server);

//io.sockets.on('connection', function(socket){
//    socket.emit('message',{message: 'Congratulations, you are now connected =)'})
//});

function describeRoom(name) {
    var clients = io.sockets.clients(name);
    var result = {
        clients: {}
    };
    clients.forEach(function (client) {
        result.clients[client.id] = client.resources;
    });
    return result;
}

function safeCb(cb) {
    if (typeof cb === 'function') {
        return cb;
    } else {
        return function () {};
    }
}

io.sockets.on('connection', function (client) {
    client.resources = {
        screen: false,
        video: true,
        audio: false
    };

    // pass a message to another id
    client.on('message', function (details) {
        var otherClient = io.sockets.sockets[details.to];
        if (!otherClient) return;
        details.from = client.id;
        otherClient.emit('message', details);
    });

    client.on('shareScreen', function () {
        client.resources.screen = true;
    });

    client.on('unshareScreen', function (type) {
        client.resources.screen = false;
        if (client.room) removeFeed('screen');
    });

    client.on('join', join);

    function removeFeed(type) {
        io.sockets.in(client.room).emit('remove', {
            id: client.id,
            type: type
        });
    }

    function join(name, cb) {
        // sanity check
        if (typeof name !== 'string') return;
        // leave any existing rooms
        if (client.room) removeFeed();
        safeCb(cb)(null, describeRoom(name))
        client.join(name);
        client.room = name;
    }

    // we don't want to pass "leave" directly because the
    // event type string of "socket end" gets passed too.
    client.on('disconnect', function () {
        removeFeed();
    });
    client.on('leave', removeFeed);

    client.on('create', function (name, cb) {
        if (arguments.length == 2) {
            cb = (typeof cb == 'function') ? cb : function () {};
            name = name || 'Mikes Custom Id';
        } else {
            cb = name;
            name = 'Mikes Custom Id';
        }
        // check if exists
        if (io.sockets.clients(name).length) {
            safeCb(cb)('taken');
        } else {
            join(name);
            safeCb(cb)(null, name);
        }
    });
});
