controllers.controller('ChatCtrl', ['$scope', '$http', '$log', 
	function ($scope, $http, $log) {
	    $scope.friends = [];
	    $scope.friendsPaginationData = {
	        currentPage: 1,
	        itemsPerPage: 10,
	        totalItems: 0,
	        maxPageNumers: 7,
	        pageChanged: function () {
	            $scope.findFriends();
	        }
	    };

	    $scope.myFriends = [];
	    $scope.myFriendsPaginationData = {
	        currentPage: 1,
	        itemsPerPage: 10,
	        totalItems: 0,
	        maxPageNumers: 7,
	        pageChanged: function () {
	            $scope.findMyFriends();
	        }
	    };

	    $scope.chatHistoryPaginationData = {
	        currentPage: 1,
	        itemsPerPage: 10,
	        totalItems: 0,
	        maxPageNumers: 7,
	        pageChanged: function () {
	            $scope.getChatHistory();
	        }
	    };

	    $scope.selectedTab = 1;// 1=my friends search, 2=friend search,
	    $scope.activeFriend;//this is the currently selected friend
        
	    $scope.init = function () {
	        $scope.findMyFriends();
	        $(function () {

	        });
	    }
	    
	    $scope.findFriends = function () {	        
	        $http.get("/api/user/FindFriends", {
	            params: {
	                searchCriteria: $scope.friendSearchCriteria,
	                pageNumber: $scope.friendsPaginationData.currentPage,
	                pageSize: $scope.friendsPaginationData.itemsPerPage
	            }
	        }).success(function (data) {
	            $scope.friends = data.data;
	            $scope.friendsPaginationData.totalItems = data.totalItems;
	        });
	    }

	    $scope.findMyFriends = function () {
	        //search for users matching the search criteria
	        var criteria = !$scope.myFriendSearchCriteria || $scope.myFriendSearchCriteria.toString().trim() == "" ? "all" : $scope.myFriendSearchCriteria;

	        $http.get("/api/user/FindMyFriends", {
	            params: {
	                searchCriteria: criteria,
	                pageNumber: $scope.myFriendsPaginationData.currentPage,
	                pageSize: $scope.myFriendsPaginationData.itemsPerPage
	            }
	        }).success(function (data) {
	            $scope.myFriends = data.data;
	            $scope.myFriendsPaginationData.totalItems = data.totalItems;
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

	        $scope.getChatHistory();
	    }

	    $scope.getChatHistory = function () {
	        //get chat history
	        $http.get("/api/user/getChatHistory", {
	            params: {
	                friendUserID: $scope.activeFriend.id,
	                pageNumber: $scope.chatHistoryPaginationData.currentPage,
	                pageSize: $scope.chatHistoryPaginationData.itemsPerPage
	            }
	        }).success(function (data) {
	            $scope.activeFriend.messageHistory = data.data;
	            $scope.chatHistoryPaginationData.totalItems = data.totalItems;
	        });
	    }

	    $scope.callFriend = function (friend) {
	        $scope.myFriendClick(friend);

	        //send the call request:TODO
            
	    }

	    $scope.removeFriend = function (friend) {

	    }

	    $scope.sendTextMessage = function () {
	        if ($(".new-message textarea").val().trim()!="") {
	            postChatHistory($scope.textMessage);

	            //TODO: send message using peerjs
	            $scope.activeFriend.messageHistory.push({ message: $scope.textMessage, datePosted: (new Date()).toDateString(), senderName: "me" });

	            $scope.textMessage = "";
	            $(".messages .scrollable").scrollTop($(document).height());
	            
	        }
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