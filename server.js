var express = require("express"),
    Spotify = require("spotify-web"),
    spotifysearch = require('spotify');

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

var current_users = {data: 0, users: [{ data: 0, name: "Bot", id: 0 }]};
var users_websockets_and_ids = [{id: 0, ws: ""}];

wss.on('connection', function(ws) {
    console.log('websocket connection open');

    var id = Math.floor(Math.random()*90000) + 10000;

    var new_user = {data: 0, name: "Guest", id: id};
    
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

        function getSpotifyURI(search) {
            spotifysearch.search({ type: 'track', query: search }, function(err, data) {
                if ( err ) {
                    console.log('Error occurred: ' + err);
                    return;
                }

                if(data != null && data.tracks != null && data.tracks[0] != null
                    && data.tracks[0].href != null) {
                    console.log(search + " coming right up!")
                    var track = JSON.stringify({data: 1, song: data.tracks[0].href, user: message.user });
                    wss.broadcast(track);
                }
            });
        }

        switch(message.data) {
            case 1:
                getSpotifyURI(message.text);
                break;
            case 2:
                wss.broadcast(data);
                break;
            case 3:
                for(var i = 0; i < current_users.users.length; i++) {
                    if(current_users.users[i].id == message.id) {
                        current_users.users[i].name = message.name;
                        break;
                    }
                }
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


Spotify.login("USERNAME", "PASSWORD", function (err, spotify) {
    console.log("Spotify connected");

    if (err) throw err;

    app.get("/audio/:uri", function (req, res) {
        spotify.get(req.params.uri, function (err, track) {
            track.play().pipe(res);
        });
    });
});
