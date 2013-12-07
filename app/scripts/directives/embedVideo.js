app.directive('embedVideo', function ($compile, $timeout) {
    return {
        restrict: 'E',
        scope:{},
        link: function (scope, element, attrs) {
            if(scope.$parent.youtube) {
                scope.url = scope.$parent.src;
                jQuery(element).append(
                    $compile(
                        '<iframe width="560" height="315" src="{{url}}" frameborder="0" allowfullscreen></iframe>'
                    )(scope)
                );
            }
        }
    };
});