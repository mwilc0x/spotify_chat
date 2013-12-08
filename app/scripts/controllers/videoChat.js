'use strict'
app.controller('videoChat', function videoChat($scope, videoChatService) {

    $scope.video = false;

    $scope.connect = function() {

        videoChatService.show();
        videoChatService.connect();
        $scope.video = true;
    };

    $scope.disconnect = function() {
        videoChatService.hide();
        videoChatService.disconnect();
        $scope.video = false;
    }
});