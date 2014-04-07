controllers.controller('LoginCtrl', ['$scope', '$http', '$log',
	function ($scope, $http, $log) {

	    $scope.$on('event:google-plus-auth-success', function (event, authResult) {
	        
	        console.log(authResult);
	    });
	    $scope.$on('event:google-plus-auth-failure', function (event, authResult) {
	        
	        console.log(authResult);
	    });
	    
	}]);