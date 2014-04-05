controllers.controller('ChatCtrl', ['$scope', '$http', '$log',
	function ($scope, $http, $log) {
	    $scope.friends = [];
	    $scope.myFriends = [];
	    $scope.selectedTab = 1;//2=friend search, 1=my friends search
	    
	    $scope.findFriend = function () {	        
	        $http.get("/api/user/FindFriend", { params: { searchCriteria: $scope.friendSearchCriteria } }).success(function (data) {
	            $scope.friends = data;
	        });
	    }

	    $scope.findMyFriend = function () {
	        //search for users matching the search criteria
	        var criteria = !$scope.myFriendSearchCriteria || $scope.myFriendSearchCriteria.toString().trim() == "" ? "all" : $scope.myFriendSearchCriteria;

	        $http.get("/api/user/FindMyFriends", { params: { searchCriteria: criteria } }).success(function (data) {
	            $scope.myFriends = data;
	        });
	    }
        
	    $scope.addToFriends = function (user) {
	        $http.post("/api/user/addToFriends", { friendUserID: user.id }).success(function (data) {
	            //repopulate friends list so that the "add friend" button is not shown anymore as the friend is already added
	            $scope.findFriend($scope.searchCriteria);
	        });	       
	    }

	    $scope.callFriend = function (friend) {
	    }

	    $scope.textFriend = function (friend) {
	    }

	    $scope.friendsTabClick = function (tabID) {
	        $scope.selectedTab = tabID;
	    }

              
	}]);