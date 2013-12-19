app.factory('messageType', function() {
    return {
        decipher: function(message) {
            var data;
            var search = message;

            if(message.search('!spotify ') != -1) {
                data = "song-info";
                search = message.substring(9, message.length);
            }
            else if(message.search('!youtube ') != -1) {
                data = "youtube-info";
                search = message.substring(9, message.length);
            }
            else if(message.search('!maps ') != -1) {
                data = "maps-info";
                search = message.substring(6, message.length);
            }
            else {
                data = "chat-message";
            }

            return {data: data, text: search, message: message};
        }
    };
});