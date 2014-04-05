controllers.controller('ChatCtrl', ['$scope', '$http', '$log',
	function ($scope, $http, $log) {
	    $scope.friends = [];
	    $scope.myFriends = [];
	    $scope.selectedTab = 1;//2=friend search, 1=my friends search
	    $scope.activeFriend;//this is the currently selected friend

	    $scope.init = function () {
	        $scope.findMyFriend();
	    }
	    
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

              
	}]);