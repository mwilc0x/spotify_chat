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

var current_users = [{name: "Bot"}];

wss.on('connection', function(ws) {
    console.log('websocket connection open');

    var new_user = JSON.stringify({data: 0, name: "Guest", id: 1});
    current_users.push(new_user);
    //ws.send(new_user, function() {  });

    wss.broadcast(new_user);

    ws.on('message', function(data, flags) {
        // flags.binary will be set if a binary data is received
        // flags.masked will be set if the data was masked
        //console.log('Got message ' + data);
        var message = JSON.parse(data);

        console.log('Got message ' + message.text + " with data type: " + message.data);
        //wss.broadcast(data);

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
        }
    });

    ws.on('close', function() {
        console.log('websocket connection close');
    });
});

Spotify.login("YOUR_USERNAME", "YOUR_PASSWORD", function (err, spotify) {
    console.log("Spotify connected");

    if (err) throw err;

    app.get("/audio/:uri", function (req, res) {
        spotify.get(req.params.uri, function (err, track) {
            track.play().pipe(res);
        });
    });
});
