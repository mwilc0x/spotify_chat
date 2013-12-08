function onGoogleReady() {
    console.log("Google maps api initialized.");
    angular.bootstrap(document.getElementById("map"), ['app.ui-map']);
}

angular.module('app.ui-map', ['ui.map'])
  .controller('MapCtrl', ['$scope', '$rootScope', 'maps', function ($scope, $rootScope, maps) {
    $scope.lat = maps.model.lat;
    $scope.lng = maps.model.lng;


    $scope.mapOptions = {
        center: new google.maps.LatLng($scope.lat, $scope.lng),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
}]);
