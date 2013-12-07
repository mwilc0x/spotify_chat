'use strict'
app.controller('videoChat', function videoChat($scope, videoChatService) {

    $scope.video = false;

    $scope.connect = function() {
        videoChatService.show();
        videoChatService.connect();
    };
});