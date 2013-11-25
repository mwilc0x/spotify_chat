'use strict'
app.controller('modalController', function modalController($scope, $modalInstance) {
    $scope.nick = "Guest";
    $scope.usernameInputFocused = true;

    $scope.ok = function (nick) {
        $modalInstance.close(nick);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.loseFocus = function() {
        $scope.usernameInputFocused = false;
    };
});