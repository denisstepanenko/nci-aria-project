controllers.controller('ChatCtrl', ['$scope', '$http', '$log',
	function ($scope, $http, $log) {
	    $scope.friends = [];
	    $scope.searchCriteria = "adsf";

	    $scope.findFriend = function (searchCriteria) {
	        //search for users matching the search criteria
	        $http.get("/api/user/FindFriend", { params: { searchCriteria: searchCriteria } }).success(function (data) {
	            $scope.friends = data;
	        });
	    }

	    $scope.addToFriends = function (user) {
	        $http.post("/api/user/addToFriends", { friendUserID: user.id }).success(function (data) {
	            //repopulate friends list so that the "add friend" button is not shown anymore as the friend is already added
	            $scope.findFriend($scope.searchCriteria);
	        });

	       
	    }

	}]);