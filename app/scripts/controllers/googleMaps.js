app.controller('MapCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.lat = 40.722283;
    $scope.lng = -74.005623;

    $rootScope.$on('mapsRequested', function (evt, mapsRequest) {
        $scope.lat = mapsRequest.lat;
        $scope.lng = mapsRequest.lng;
    });

    $scope.mapOptions = {
        center: new google.maps.LatLng($scope.lat, $scope.lng),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
}]);
