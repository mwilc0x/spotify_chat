'use strict';

var app = angular.module('chatApp', ['ui.bootstrap']);
  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });
  });
