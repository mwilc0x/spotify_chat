app.directive('embedVideo', function ($compile) {
    return {
        link: function ($scope, element, attrs) {
            if($scope.youtube) {
                jQuery(element).append(
                    $compile(
                        '<iframe width="560" height="315" src="{{videosrc}}" frameborder="0" allowfullscreen></iframe>'
                    )($scope)
                );
                $scope.youtube = false;
            }
        }
    }
});