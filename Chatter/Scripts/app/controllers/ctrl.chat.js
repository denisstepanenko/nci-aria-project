controllers.controller('ChatCtrl', ['$scope', '$http', '$log', 
	function ($scope, $http, $log) {
	    $scope.friends = [];
	    $scope.myFriends = [];
	    $scope.selectedTab = 1;// 1=my friends search, 2=friend search,
	    $scope.activeFriend;//this is the currently selected friend
        
	    $scope.init = function () {
	        $scope.findMyFriends();
	    }
	    
	    $scope.findFriends = function () {	        
	        $http.get("/api/user/FindFriends", { params: { searchCriteria: $scope.friendSearchCriteria } }).success(function (data) {
	            $scope.friends = data;
	        });
	    }

	    $scope.findMyFriends = function () {
	        //search for users matching the search criteria
	        var criteria = !$scope.myFriendSearchCriteria || $scope.myFriendSearchCriteria.toString().trim() == "" ? "all" : $scope.myFriendSearchCriteria;

	        $http.get("/api/user/FindMyFriends", {
	            params: {
	                searchCriteria: criteria,
	                pageNumber: $scope.bigCurrentPage,
	                pageSize: $scope.itemsPerPage
	            }
	        }).success(function (data) {
	            $scope.myFriends = data.data;
	            $scope.bigTotalItems = data.totalItems;
	        });
	    }
        
	    $scope.addToFriends = function (user) {
	        $http.post("/api/user/addToFriends", { friendUserID: user.id }).success(function (data) {
	            //repopulate friends list so that the "add friend" button is not shown anymore as the friend is already added
	            $scope.findFriends($scope.searchCriteria);
	        });	       
	    }

	    $scope.myFriendClick = function (friend) {
	        $scope.activeFriend = friend;

	        //get chat history
	        $http.get("/api/user/getChatHistory", { params: { friendUserID: $scope.activeFriend.id } }).success(function (data) {
	            $scope.activeFriend.messageHistory = data;
	        });
	    }

	    $scope.callFriend = function (friend) {
	        $scope.myFriendClick(friend);

            //send the call request:TODO
	    }

	    $scope.sendTextMessage = function () { 
	        postChatHistory($scope.textMessage);
	                    
	        //TODO: send message using peerjs
	        $scope.activeFriend.messageHistory.push({ message: $scope.textMessage, datePosted: new Date() });

	        $scope.textMessage = "";
	    }

	    var postChatHistory = function (message) {
	        //posts the message
	        $http.post("/api/user/postTextMessage", {
	            friendUserID: $scope.activeFriend.id,
	            message: message
	        }).success(function (data) {	            
	            //do nothing as this is "fire and forget" post, used just for history 
	        });	        
	    }
        
	    $scope.friendsTabClick = function (tabID) {
	        $scope.selectedTab = tabID;
	    }


                	   
	    $scope.itemsPerPage = 2;

	    $scope.maxPageNumers = 7;
	    $scope.bigTotalItems = 127;
	    $scope.bigCurrentPage = 1;//TODO: use $scope.$watch to react when this is changed, OR on-select-page="setPage(page)"
        
	    $scope.pageChanged = function () {
	        $scope.findMyFriends();
	    }
              
	}]);