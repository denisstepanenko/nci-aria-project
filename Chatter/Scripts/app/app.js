
var chatterApp = angular.module('chatterApp', ['ngRoute', 'controllers', 'directive.googlePlusAuth']);

var controllers = angular.module('controllers', ['ui.bootstrap', 'configs']);
var configs = angular.module('configs', []);

chatterApp.config(['$locationProvider', '$routeProvider',
  function ($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(false);

    
      $routeProvider.
        when('/', {
            templateUrl: '/Scripts/app/views/home.html',
            controller: 'HomeCtrl'
        }).
          when('/chat', {
              templateUrl: '/Scripts/app/views/chat.html',
              controller: 'ChatCtrl'
          }).
        when("/login", {
            templateUrl: '/Scripts/app/views/login.html',
            controller: 'LoginCtrl'
        }).
           when("/profile", {
               //this is a hack because the profile was enbedded into login view, so no time changing this for now
               templateUrl: '/Scripts/app/views/login.html',
               controller: 'LoginCtrl'
           }).        
          //when("/demo", {
          //    templateUrl: '/Scripts/app/views/demo.html',
          //    controller: 'DemoCtrl'
          //}).          
        otherwise({
            redirectTo: '/'
        });
  }]);

//Authorisation 
chatterApp.run(function($rootScope, $location, $http) {

  
    $rootScope.userInfo = {};
    
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if ($location.path() == "/chat") {
            if (!$rootScope.userInfo || !$rootScope.userInfo.userId || $rootScope.userInfo.userId == 0) {

                alert('You need to log in first!');

                if (next.templateUrl == "/Scripts/app/views/login.html") {
                } else {
                    $location.path("/login");
                }
            }
        }
    });

    $rootScope.$on('event:google-plus-auth-success', function (event, authResult) {        
        try {
            if (authResult.status.google_logged_in == true) {
                $http.get("/api/auth/GetUserId", {
                    params: {
                        authType: 1,
                        accessToken: authResult.access_token
                    }
                }).success(function (data) {
                    $rootScope.userInfo = data;
                    $rootScope.loggedOn = (data.userId > 0);
                }).error(function (data, status, headers, config) {
                    $log.error(data);
                    $rootScope.userInfo = {};
                    $rootScope.loggedOn = false;
                });
            }

        } catch (e) {
            $log.error(e.message);
            $rootScope.userInfo = {};
            $rootScope.loggedOn = false;
        }

    });

    $rootScope.$on('event:google-plus-auth-failure', function (event, authResult) {
        $rootScope.userInfo = {};
        $rootScope.loggedOn = false;
    });

});

