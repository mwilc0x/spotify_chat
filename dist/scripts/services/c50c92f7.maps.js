app.service('maps', function($rootScope) {

    var service = {
        model: {
            lat: '',
            lng: ''
        },

        SetCoordinates: function (mapsRequest) {
            service.model.lat = mapsRequest.lat;
            service.model.lng = mapsRequest.lng;
        }
    }

    $rootScope.$on('mapsRequested', function(evt, mapsRequest) {
        service.SetCoordinates(mapsRequest)
    });

    return service;
});