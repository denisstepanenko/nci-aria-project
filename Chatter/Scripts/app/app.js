var chatterApp = angular.module('chatterApp', ['ngRoute', 'controllers']);
var controllers = angular.module('controllers', []);

chatterApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/', {
            templateUrl: '/Scripts/app/views/home.html',
            controller: 'HomeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  }]);