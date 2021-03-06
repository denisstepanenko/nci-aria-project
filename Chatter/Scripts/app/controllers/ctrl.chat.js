﻿//angular api: http://docs.angularjs.org/api/
//peerJS API: http://peerjs.com/docs/

controllers.controller('ChatCtrl', ['$rootScope', '$scope', '$http', '$log', 'ChatterConfig',
	function ($rootScope, $scope, $http, $log, ChatterConfig) {
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

	    var initSignalR = function () {
	        
	            $.connection.chatHub.client.incomingCall = function (callerPeerID, callerUserID) {
	                $scope.$apply(function (scope) {
	                    //the call recipient should handle incoming call request here
	                    if (confirm("Incomming call, answer?")) {
	                        // Initiate a call!
	                        var call = $rootScope.peer.call(callerPeerID, window.localStream);

	                        step3(call, scope);
	                        
	                        //get the user and show their chat hisotry and video window
	                        $http.get("/api/user/GetMyFriend", {
	                            params: {
	                                userID: callerUserID,
	                            }
	                        }).success(function (data) {
	                            scope.activeCallUser = data;
	                            scope.myFriendClick(data);//this is to make a calling user active and get their chat history
	                        });
	                    }
	                });
	            }

	            $.connection.chatHub.client.callEndRequest = function () {
	                $scope.$apply(function (scope) {
	                    scope.endCall();
	                });
	            }

	            $.connection.chatHub.client.incomingTextMessage = function (message, senderID, senderFullName) {
	                $scope.$apply(function (scope) {
	                    //the recipient should handle incoming text message request here
	                    
	                    if (scope.activeFriend && scope.activeFriend.id == senderID) {
	                        //Don't need to worry about inactive users because as soon as the user clicks on another user, the message list will be retrieved fromt he server. 
	                        scope.activeFriend.messageHistory.push({ message: message, datePosted: (new Date()).toDateString(), senderName: scope.activeFriend.name });
	                    }
	                    else {
	                        toastr.success(senderFullName + " says \"" + message + "\"");
	                    }
	                });
	            }

	            // Start the connection.
	            $.connection.hub.start().done(function () {
	                $.connection.chatHub.server.imOnline();
	            }).fail(function (e1, e2, e3, e4) {
	                $scope.$apply(function (scope) {
	                    console.log(err.message);
	                    scope.videoError = "Error ocurred, please try again...";
	                    console.log("chathub error..");
	                });
	            });
	        
	    }

	    $rootScope.localPeerID;
           
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

	            //resize video boxes as the browser size is changing
	            $(window).on("resize", function () {
	                var theirWidth = $("#their-video").width();
	                if (theirWidth != 100) {
	                    //initial width is 100

	                    var myWidth=$("#my-video").width();
                        
	                    $("#my-video").width(theirWidth / 4.15);
	                    $("#my-video").offset({ left: $("#their-video").offset().left + theirWidth - myWidth - 10 });
	                }

	            });
	        });

	        initSignalR();

	        initPeerJs();
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

	    $scope.findMyFriends = function (connectionID) {       
	        //search for users matching the search criteria
	        var criteria = !$scope.myFriendSearchCriteria || $scope.myFriendSearchCriteria.toString().trim() == "" ? "all" : $scope.myFriendSearchCriteria;

	        $http.get("/api/user/FindMyFriends", {
	            params: {
	                searchCriteria: criteria,
	                pageNumber: $scope.myFriendsPaginationData.currentPage,
	                pageSize: $scope.myFriendsPaginationData.itemsPerPage,
	                signalConnectionID: connectionID
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
	        window.initializeBrowserVideo();
            
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
	        $.connection.chatHub.server.callRequest(friend.id, $rootScope.localPeerID);

	        $scope.activeCallUser = friend;
	    }

	    $scope.callFriendRetry = function () {            
	        $scope.endCall();
	        $scope.callFriend($scope.activeFriend);
	        $scope.$apply();//force to rerender the view as $scope.activeCallUser has changed.
	    }

	    $scope.endCall = function () {
	        if (window.existingCall) {
	            window.existingCall.close();
	        }

	        if ($scope.activeCallUser) {
	            try{
	                $.connection.chatHub.server.callTerminated($scope.activeCallUser.id)
	            }
	            catch (ex) {
	                console.log("error sending callTErminated request");
	            }

	            if (window.existingCall) {
	                toastr.info('Call ended');//only show notice if call was acually ended
	            }
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

	                toastr.info('Friend removed')
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
	    function initPeerJs() {
	        // PeerJS object
	        $rootScope.peer = new Peer({
	            key: ChatterConfig.PeerJSApiKey, debug: 3, config: {
	                'iceServers': [
                      { url: 'stun:stun.l.google.com:19302' } // Pass in optional STUN and TURN server for maximum network compatibility
	                ]
	            }
	        });

	        $rootScope.peer.on('open', function () {
	            $rootScope.localPeerID = $rootScope.peer.id;
	        });

	        // Receiving a call
	        $rootScope.peer.on('call', function (call) {
	            // answer the call automatically as the incomming call dialog will be shown when incomming call from SignalR function is triggered
	            call.answer(window.localStream);

	            $scope.$apply(function (scope) {
	                step3(call, scope);
	            });
	            //step3(call, $scope);
	        });

	        $rootScope.peer.on('error', function (err) {
	            $scope.$apply(function (scope) {
	                console.log(err.message);
	                scope.videoError = "Error ocurred, please try again...";
	                console.log("peerjs error..");
	            });
	        });
	    }

	    window.initializeBrowserVideo = function () {
	        // Compatibility shim
	        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	        if (!navigator.getUserMedia) {
	            $scope.browserIncompatible = true;
	            return;
	        }

	        // Get audio/video stream
	        navigator.getUserMedia({
	            audio: true,
	            video: {
	                "mandatory": {
	                    "minWidth": "320",
	                    "minHeight": "240",
	                },
	                "optional": []
	            }
	        }, function (stream) {
	            // Set your video displays
	            $('#my-video').show().prop('src', URL.createObjectURL(stream));

	            window.localStream = stream;	            
	        }, function (e) {
	            $scope.videoError = "Cannot get video stream, please ensure browser is allowed to access the webcam and try again";
	            $('#my-video').hide();
	        });
	    }

	    function step3(call, scope) {

	        scope.videoError = "";

	        // Hang up on an existing call if present
	        if (window.existingCall) {
	            window.existingCall.close();
	        }

	        //call could be null if the user didn't allow to use the webcam in the browser
	        if (call) {
	            // Wait for stream on the call, then set peer video display
	            call.on('stream', function (stream) {
	                $('#their-video').attr('src', URL.createObjectURL(stream));
	            });

	            call.on("error", function (e) {
	                debugger
	            });

	            // UI stuff
	            window.existingCall = call;
	            call.on('close', function () {
	                if (scope.activeCallUser) {//in case call dropped
	                    toastr.info('Call ended');
	                }
	            });
	        }
	        else {
	            //informs the user that they have to allow the use of webcam through the browser
	            scope.videoError = "Cannot get video stream, please ensure browser is allowed access the webcam and try again";
	        }

	    }
        //END PEERJS STUFF
	}]);