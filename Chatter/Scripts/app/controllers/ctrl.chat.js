﻿controllers.controller('ChatCtrl', ['$scope', '$http', '$log', 
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
	        if (confirm("Are you sure?")) {
	            $http.delete("/api/user/removeFriend", {
	                params: {
	                    friendUserID: friend.id
	                }
	            }).success(function () {
	                //removing from the array once removed fromthe DB (avoiding reload)
	                var idx = $scope.myFriends.indexOf(friend);
	                if (idx >= 0) {
	                    $scope.myFriends.splice(idx, 1);
	                }
	            });
	        }
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

	        if ($scope.selectedTab == 1) {
                //reloading myFriends list
	            $scope.findMyFriends();
	        }
	    }


	    //PEERJS STUFF  

	    // Compatibility shim
	    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	    // PeerJS object
	    var peer = new Peer({
	        key: 'lwjd5qra8257b9', debug: 3, config: {
	            'iceServers': [
                  { url: 'stun:stun.l.google.com:19302' } // Pass in optional STUN and TURN server for maximum network compatibility
	            ]
	        }
	    });

	    peer.on('open', function () {
	        $('#my-id').text(peer.id);
	    });

	    // Receiving a call
	    peer.on('call', function (call) {
	        // Answer the call automatically (instead of prompting user) for demo purposes
	        call.answer(window.localStream);
	        step3(call);
	    });
	    peer.on('error', function (err) {
	        alert(err.message);
	        // Return to step 2 if error occurs
	        step2();
	    });

	    // Click handlers setup
	    $(function () {
	        $('#make-call').click(function () {
	            // Initiate a call!
	            var call = peer.call($('#callto-id').val(), window.localStream);

	            step3(call);
	        });

	        $('#end-call').click(function () {
	            window.existingCall.close();
	            step2();
	        });

	        // Retry if getUserMedia fails
	        $('#step1-retry').click(function () {
	            $('#step1-error').hide();
	            step1();
	        });

	        // Get things started
	        step1();
	    });

	    function step1() {
	        // Get audio/video stream
	        navigator.getUserMedia({ audio: true, video: true }, function (stream) {
	            // Set your video displays
	            $('#my-video').prop('src', URL.createObjectURL(stream));

	            window.localStream = stream;
	            step2();
	        }, function () { $('#step1-error').show(); });
	    }

	    function step2() {
	        $('#step1, #step3').hide();
	        $('#step2').show();
	    }

	    function step3(call) {
	        // Hang up on an existing call if present
	        if (window.existingCall) {
	            window.existingCall.close();
	        }

	        // Wait for stream on the call, then set peer video display
	        call.on('stream', function (stream) {
	            $('#their-video').prop('src', URL.createObjectURL(stream));
	        });

	        // UI stuff
	        window.existingCall = call;
	        $('#their-id').text(call.peer);
	        call.on('close', step2);
	        $('#step1, #step2').hide();
	        $('#step3').show();
	    }
        //END PEERJS STUFF
	}]);