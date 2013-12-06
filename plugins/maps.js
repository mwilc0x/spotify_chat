var gm = require('googlemaps'),
    prettyjson = require('prettyjson');


exports.getCoordinates = function(addr, message, broadcast) {
    gm.geocode(addr, function(err, data){
        //console.log('searching for ' + addr);

        var track = JSON.stringify({data: "maps-info", addr: "test", user: message.user, lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng});
        //console.log(prettyjson.render(data.results[0].geometry.location));

        if(broadcast != null) broadcast(track);
    });
}
