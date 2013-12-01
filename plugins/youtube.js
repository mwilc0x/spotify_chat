var youtube = require('youtube-feeds');

exports.search = function(search, message, broadcast) {
    youtube.feeds.videos( {q: search, 'max-results': 1 }, function(err,data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }

        if(data != null && data.items != null && data.items[0] != null) {
            //console.log(data);
            var title = data.items[0].title;
            var video = JSON.stringify({data: "youtube-info", videoID: data.items[0].id, user: message.user, title: title});

            if(broadcast != null) broadcast(video);
        }
    });
}