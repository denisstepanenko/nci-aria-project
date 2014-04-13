
var chatterApp = angular.module('chatterApp', ['ngRoute', 'controllers', 'directive.googlePlusAuth']);

var controllers = angular.module('controllers', ['ui.bootstrap']);

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
          when("/demo", {
              templateUrl: '/Scripts/app/views/demo.html',
              controller: 'DemoCtrl'
          }).          
        otherwise({
            redirectTo: '/'
        });
  }]);

//Authorisation 
chatterApp.run(function($rootScope, $location) {    
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

    $rootScope.logoutClick = function () {
        $http.post("/api/user/logout").success(function () {
            $location.path("/");
        });        
    }
});

