var express = require("express"),
    youtube = require('./plugins/youtube.js'),
    spotify = require('./plugins/spotify.js');

var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express()
    , port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/dist'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');

wss.broadcast = function(new_user) {
    for(var i in this.clients) {
        this.clients[i].send(new_user);
    }
};

// init plugins
spotify.launch(app);

var current_users = {data: "user-info", users: [{ data: "user-info", name: "Bot", id: 0 }]};
var users_websockets_and_ids = [{id: "user-info", ws: ""}];

wss.on('connection', function(ws) {
    console.log('websocket connection open');

    var id = Math.floor(Math.random()*90000) + 10000;

    var new_user = {data: "user-info", name: "Guest", id: id};
    
    // send full user list to client first time connect
    ws.send(JSON.stringify({data: "user-list", users: current_users}));
    current_users.users.push(new_user);
    
    // broadcast that new user joined to everyone
    new_user = JSON.stringify(new_user);
    wss.broadcast(new_user);
    
    // keep a record of user id and websocket object on server
    var user_websocket_id = {id: id, ws: ws};
    users_websockets_and_ids.push(user_websocket_id);
    
    ws.on('message', function(data, flags) {
        // flags.binary will be set if a binary data is received
        // flags.masked will be set if the data was masked
        var message = JSON.parse(data);

        switch(message.data) {
            case "song-info":
                spotify.getURI(message.text, message, function(track) {
                    wss.broadcast(track);
                });

                break;
            case "chat-message":
                wss.broadcast(data);
                break;
            case "user-info-change":
                for(var i = 0; i < current_users.users.length; i++) {
                    if(current_users.users[i].id == message.id) {
                        current_users.users[i].name = message.name;
                        break;
                    }
                }
                wss.broadcast(data);
                break;
            case "youtube-info":
                wss.broadcast(data);
                break;
        }
    });

    ws.on('close', function() {
        for(var j = 0; j < users_websockets_and_ids.length; j++) {
            if(users_websockets_and_ids[j].id == id) {
                delete users_websockets_and_ids[j].ws;
                users_websockets_and_ids.splice(j,1);
                current_users.users.splice(j,1);
                wss.broadcast(JSON.stringify({data: "delete-user", id: id}));
                break;
            }
        }
        
        console.log('websocket connection close');
    });
});

module.exports = app;