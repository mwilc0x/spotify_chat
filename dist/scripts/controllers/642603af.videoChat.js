'use strict'
app.controller('videoChat', function videoChat($scope, videoChatService) {

    videoChatService.show();

    $scope.template = {
        url: "../views/videoChat.html"
    }

    $scope.video = false;

    $scope.connect = function() {
        $scope.video = true;
        videoChatService.connect();

    };

    $scope.disconnect = function() {
        videoChatService.hide();
        //videoChatService.disconnect();
        $scope.video = false;
    }
});