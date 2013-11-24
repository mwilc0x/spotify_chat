'use strict';
var app = angular.module('chatApp', ['ui.bootstrap']);
app.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    });
  }
]);