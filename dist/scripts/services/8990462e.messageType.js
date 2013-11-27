app.factory('messageType', function() {
    return {
        decipher: function(message) {
            var data;
            if(message.search('!spotify ') != -1) {
                data = 1;
                message = message.substring(9, message.length);
            }
            else {
                data = 2;
            }

            return {data: data, text: message};
        }
    };
});