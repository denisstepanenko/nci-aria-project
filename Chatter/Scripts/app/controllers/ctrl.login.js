controllers.controller('LoginCtrl', ['$rootScope', '$scope', '$http', '$log', 
	function ($rootScope, $scope, $http, $log) {

	    //$scope.$on('event:google-plus-auth-success', function (event, authResult) {            
	    //    try {                    
	    //        if (authResult.status.google_logged_in == true) {
	    //            $http.get("/api/auth/GetUserId", {
	    //                params: {
	    //                    authType: 1,
	    //                    accessToken: authResult.access_token
	    //                }
	    //            }).success(function (data) {
	    //                $rootScope.userInfo = data;
	    //                $rootScope.loggedOn = (data.userId > 0);
	    //            }).error(function (data, status, headers, config) {
	    //                $log.error(data);
	    //                $rootScope.userInfo = {};
	    //                $rootScope.loggedOn = false;
	    //            });
	    //        }
	            
	    //    } catch (e) {
	    //        $log.error(e.message);
	    //        $rootScope.userInfo = {};
	    //        $rootScope.loggedOn = false;
	    //    } 
            
	    //});

	    //$scope.$on('event:google-plus-auth-failure', function (event, authResult) {	        
	    //    $rootScope.userInfo = {};
	    //    $rootScope.loggedOn = false;
	    //});

	    $scope.commingSoonClick = function (e) {
	        e.preventDefault();

	        alert("Comming soon...");
	    }
	    
	}]);