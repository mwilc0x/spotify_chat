app.service('maps', function($rootScope) {

    var service = {
        model: {
            lat: '',
            lng: ''
        },

        RestoreState: function (mapsRequest) {
            service.model.lat = mapsRequest.lat;
            service.model.lng = mapsRequest.lng;
        }
    }

    $rootScope.$on('mapsRequested', function(evt, mapsRequest) {
        service.RestoreState(mapsRequest)
    });

    return service;
});