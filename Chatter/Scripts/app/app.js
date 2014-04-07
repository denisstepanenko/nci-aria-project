﻿var chatterApp = angular.module('chatterApp', ['ngRoute', 'controllers', 'directive.googlePlusAuth']);
var controllers = angular.module('controllers', ['ui.bootstrap']);

chatterApp.config(['$locationProvider', '$routeProvider',
  function ($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(false);

      $routeProvider.
        //when('/', {
        //    templateUrl: '/Scripts/app/views/home.html',
        //    controller: 'HomeCtrl'
        //}).
          when('/', {
              templateUrl: '/Scripts/app/views/chat.html',
              controller: 'ChatCtrl'
          }).
        when("/login", {
            templateUrl: '/Scripts/app/views/login.html',
            controller: 'LoginCtrl'
        }).
          when("/chat", {
              templateUrl: '/Scripts/app/views/chat.html',
              //controller: 'ChatCtrl'
          }).
          when("/demo", {
              templateUrl: '/Scripts/app/views/demo.html',
              controller: 'DemoCtrl'
          }).
        otherwise({
            redirectTo: '/'
        });
  }]);
