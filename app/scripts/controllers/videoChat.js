'use strict'
app.controller('videoChat', function videoChat($scope, videoChatService) {

    $scope.video = false;

    $scope.connect = function() {
        $scope.video = true;
        $scope.$apply();
        videoChatService.show();
        videoChatService.connect();
    };
});