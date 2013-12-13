var socketio = require('socket.io'),
    express = require("express"),
    youtube = require('./plugins/youtube.js'),
    spotify = require('./plugins/spotify.js'),
    maps = require('./plugins/maps.js');

var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express()
    , port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/dist'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var io = socketio.listen(server);
var clients = [];

console.log('websocket server created');


// init plugins
spotify.launch(app);

var current_users = {data: "user-info", users: [{ data: "user-info", name: "Bot", id: 0 }]};
var users_websockets_and_ids = [{id: "user-info", ws: ""}];

io.sockets.on('connection', function(socket) {
    console.log('websocket connection open');

    clients.push(socket.id);

    var id = Math.floor(Math.random()*90000) + 10000;

    var new_user = {data: "user-info", name: "Guest", id: id};
    
    // send full user list to client first time connect
    io.sockets.socket(socket.id).emit("message", JSON.stringify({data: "user-list", users: current_users}));

    
    // broadcast that new user joined to everyone
    current_users.users.push(new_user);
    io.sockets.emit("message", JSON.stringify(new_user));
    
    // keep a record of user id and websocket object on server
    var user_websocket_id = {id: id, ws: socket};
    users_websockets_and_ids.push(user_websocket_id);
    
    socket.on('message', function(data, flags) {
        // flags.binary will be set if a binary data is received
        // flags.masked will be set if the data was masked
        var message = JSON.parse(data);

        switch(message.data) {
            case "song-info":
                spotify.getURI(message.text, message, function(track) {
                    //wss.broadcast(track);
                    io.sockets.emit("message", track);
                });

                break;
            case "chat-message":
                io.sockets.emit("message", data);
                break;
            case "user-info-change":
                for(var i = 0; i < current_users.users.length; i++) {
                    if(current_users.users[i].id == message.id) {
                        current_users.users[i].name = message.name;
                        break;
                    }
                }
                io.sockets.emit("message", data);
                break;
            case "youtube-info":

                youtube.search(message.text, message, function(video) {
                    io.sockets.emit("message", video);
                });

                break;
            case "maps-info":
                maps.getCoordinates(message.text, message, function(coords) {
                    io.sockets.emit("message", coords);
                });
        }
    });

    socket.on('disconnect', function() {
        for(var j = 0; j < users_websockets_and_ids.length; j++) {
            if(users_websockets_and_ids[j].id == id) {
                delete users_websockets_and_ids[j].ws;
                users_websockets_and_ids.splice(j,1);
                current_users.users.splice(j,1);
                io.sockets.emit("message", JSON.stringify({data: "delete-user", id: id}));
                break;
            }
        }
        
        console.log('websocket connection close');
    });
});

module.exports = app;