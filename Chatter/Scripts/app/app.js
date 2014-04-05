var chatterApp = angular.module('chatterApp', ['ngRoute', 'controllers']);
var controllers = angular.module('controllers', []);

chatterApp.config(['$locationProvider', '$routeProvider',
  function ($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(true);

      $routeProvider.
        when('/', {
            templateUrl: '/Scripts/app/views/home.html',
            controller: 'HomeCtrl'
        }).
        when("/login", {
            templateUrl: '/Scripts/app/views/login.html',
            controller: 'LoginCtrl'
        }).
          when("/chat", {
              templateUrl: '/Scripts/app/views/chat.html',
              controller: 'ChatCtrl'
          }).
          when("/demo", {
              templateUrl: '/Scripts/app/views/demo.html',
              controller: 'DemoCtrl'
          }).
        otherwise({
            redirectTo: '/'
        });
  }]);