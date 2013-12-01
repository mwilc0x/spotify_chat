app.directive('mediaPlayer', function($log) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
          title: '@',
          src: '@'
        },
        template: '<div class="player" ng-hide="!src"><h5>{{title}}</h5><audio autoplay controls src="{{src}}"></audio></div>'
    };
});