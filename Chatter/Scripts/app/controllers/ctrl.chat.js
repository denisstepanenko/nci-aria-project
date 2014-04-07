controllers.controller('ChatCtrl', ['$scope', '$http', '$log', 
	function ($scope, $http, $log) {
	    //PRIVATE STUFF
	    var postChatHistory = function (message) {
            //TODO:move this logic into SignalR hub
	        //posts the message
	        $http.post("/api/user/postTextMessage", {
	            friendUserID: $scope.activeFriend.id,
	            message: message
	        }).success(function (data) {
	            //do nothing as this is "fire and forget" post, used just for history 
	        });
	    }

	    var localPeerID;
           
	    //END PRIVATE STUFF

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
	    $scope.activeCallUser;//this is the ID of the user who's currently on a call
	    
	    $scope.init = function () {
	        $scope.findMyFriends();
                    
	        $(function () {
	            initializeBrowserVideo();
	        });

            //the SignalR init and callback handlers should be declared in init as otherwise they will end up in a different $scope
	        $.connection.chatHub.client.incomingCall = function (destPeerID) {
	            //the call recipient should handle incoming call request here
	            if (confirm("Incomming call, answer? (" + destPeerID + ")")) {
	                // Initiate a call!
	                var call = peer.call(destPeerID, window.localStream);

	                step3(call);
	            }
	        }

	        $.connection.chatHub.client.incomingTextMessage = function (message) {
	            //the recipient should handle incoming text message request here
	            alert(message);

	            //TODO: work on receiving the messages, need to ensure that the user is notified and that the message is added to the active user message list. 

	            if ($scope.activeFriend) {
	                //Don't need to worry about inactive users because as soon as the user clicks on another user, the message list will be retrieved fromt he server. 
	                $scope.activeFriend.messageHistory.push({ message: message, datePosted: (new Date()).toDateString(), senderName: $scope.activeFriend.name });
	            }
	        }

	        // Start the connection.
	        $.connection.hub.start().done(function () {
	            $.connection.chatHub.server.imOnline();
	        }).fail(function (e1, e2, e3, e4) {
	            console.log(err.message);
	            $scope.videoError = "Error ocurred, please try again...";
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
	        if ($scope.activeCallUser) {
	            if ($scope.activeCallUser.id == friend.id) {
	                //user is trying to call the friend that they're currently talking to
	                return;
	            }
	            else {
	                //user is trying to call another friend while on a call, confirm first
	                if (confirm("Current call with '" + $scope.activeCallUser.name + "' will be ended")) {
	                    $scope.endCall();
	                }
	                else {
	                    return;
	                }
	            }
	            
	        }

	        //send the call request
	        $.connection.chatHub.server.callRequest(friend.id, localPeerID);

	        $scope.activeCallUser = friend;
	    }

	    $scope.endCall = function () {
	        if (window.existingCall) {
	            window.existingCall.close();
	        }

	        $scope.activeCallUser = null;
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

	            //send message using SignalR
	            $.connection.chatHub.server.sendTextMessage($scope.activeFriend.id, $scope.textMessage);
                
	            $scope.activeFriend.messageHistory.push({ message: $scope.textMessage, datePosted: (new Date()).toDateString(), senderName: "me" });

	            $scope.textMessage = "";
	            $(".messages .scrollable").scrollTop($(document).height());	            
	        }
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
	        localPeerID = peer.id;
	    });

	    // Receiving a call
	    peer.on('call', function (call) {
	        // answer the call automatically as the incomming call dialog will be shown when incomming call from SignalR function is triggered
	        call.answer(window.localStream);

	        step3(call);
	    });

	    peer.on('error', function (err) {	        
	        console.log(err.message);
	        $scope.videoError = "Error ocurred, please try again...";
	    });
        
	    function initializeBrowserVideo() {
	        // Get audio/video stream
	        navigator.getUserMedia({ audio: true, video: true }, function (stream) {
	            // Set your video displays
	            $('#my-video').prop('src', URL.createObjectURL(stream));

	            window.localStream = stream;	            
	        }, function () {
	            $scope.videoError = "Cannot get video stream, please ensure browser is allowed access the webcam and try again";
	        });
	    }

	    function step3(call) {
	        $scope.videoError = "";

	        // Hang up on an existing call if present
	        if (window.existingCall) {
	            window.existingCall.close();
	        }

            //call could be null if the user didn't allow to use the webcam in the browser
	        if (call) {
	            // Wait for stream on the call, then set peer video display
	            call.on('stream', function (stream) {
	                $('#their-video').prop('src', URL.createObjectURL(stream));
	            });

	            // UI stuff
	            window.existingCall = call;
	            call.on('close', function () {
	                //TODO: add call ended notification
	            });
	        }
	        else {
	            //informs the user that they have to allow the use of webcam through the browser
	            $scope.videoError = "Cannot get video stream, please ensure browser is allowed access the webcam and try again";
	        }
	    }
        //END PEERJS STUFF
	}]);