app.directive('embedMap', function ($compile, $log) {
    return {
        restrict: 'E',
        scope:{},
        link: function (scope, element, attrs) {
            if(scope.$parent.maps) {
                jQuery(element).append(
                    $compile(
                        '<section id="map" ng-controller="MapCtrl"><div ui-map="myMap" ui-options="mapOptions" class="map-canvas"></div></section>'
                    )(scope)
                );
                $log.log('done compiling');
            }
        }
    };
});