controllers.controller('LoginCtrl', ['$rootScope', '$scope', '$http', '$log', 
	function ($rootScope, $scope, $http, $log) {

	    $scope.$on('event:google-plus-auth-success', function (event, authResult) {
            
	        try {
                    
	            if (authResult.status.google_logged_in == true) {
	                $http.get("/api/auth/GetUserId", {
	                    params: {
	                        authType: 1,
	                        accessToken: authResult.access_token
	                    }
	                }
	                ).success(function (data) {
	                    $rootScope.currentUserId = data.userId;
	                    $rootScope.userInfo = data;
	                    $scope.loggedOn = (data.userId > 0);
	                }).error(function (data, status, headers, config) {
	                    $log.error(data);
	                    $rootScope.currentUserId = 0;
	                    $rootScope.userInfo = {};
	                    $scope.loggedOn = false;
	                });
	            }
	            
	        } catch (e) {
	            log.error(e.message);
	            $rootScope.currentUserId = 0;
	            $rootScope.userInfo = {};
	            $scope.loggedOn = false;
	        } 
            
	    });
	    $scope.$on('event:google-plus-auth-failure', function (event, authResult) {
	        $rootScope.currentUserId = 0;
	        $rootScope.userInfo = {};
	        $scope.loggedOn = false;
	    });
	    
	}]);