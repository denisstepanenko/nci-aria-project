//useful spy cheat sheet: http://tobyho.com/2011/12/15/jasmine-spy-cheatsheet/


describe("ChatController", function () {
    beforeEach(module('ui.bootstrap'));
    beforeEach(module('controllers'));
    beforeEach(module('chatterApp'));


    var $scope, ctrl, $httpBackend, http;

    beforeEach(
        inject(function ($rootScope, $controller, _$httpBackend_, $http) {
            $scope = $rootScope.$new();
            
            $httpBackend = _$httpBackend_;
                        
            ctrl = $controller('ChatCtrl', {
                $rootScope: $rootScope,
                $scope: $scope,
                $http: $http,
                $log: null
            });
            
            $httpBackend.expectGET("/api/user/FindMyFriends?pageNumber=1&pageSize=10&searchCriteria=all")
                .respond({ data: [{ name: 'test1' }, { name: 'test2' }, { name: 'test3' }], totalItems: 3 });

            $scope.init();

            $httpBackend.flush();
        }));

    it("Get Friends", function () {
        $scope.friendSearchCriteria = 'test';
        $scope.friendsPaginationData = { currentPage:1, itemsPerPage:10 };

        //searching friends
        $httpBackend.expectGET("/api/user/FindFriends?pageNumber=1&pageSize=10&searchCriteria=test")
            .respond({ data: [{ name: 'test1' }, { name: 'test2' }], totalItems: 2 });

        $scope.findFriends();

        $httpBackend.flush();

        expect($scope.friends.length).toEqual(2);

        expect($scope.friendsPaginationData.totalItems).toEqual(2);
    });

    it("Get My Friends", function () {
        $scope.myFriendsPaginationData = 'test';
        $scope.myFriendsPaginationData = { currentPage: 1, itemsPerPage: 10 };

        //searching my friends
        $httpBackend.expectGET("/api/user/FindMyFriends?pageNumber=1&pageSize=10&searchCriteria=all")
            .respond({ data: [{ name: 'test1' }, { name: 'test2' }, { name: 'test3' }], totalItems: 3 });

        $scope.findMyFriends();
                
        $httpBackend.flush();

        expect($scope.myFriends.length).toEqual(3);

        expect($scope.myFriendsPaginationData.totalItems).toEqual(3);
    });

    it("Adds to friends and reload the fiends list", function () {
        //adding to friends
        $httpBackend.expectPOST("/api/user/addToFriends", { friendUserID: 1 })
            .respond();

        //searching friends
        $httpBackend.expectGET("/api/user/FindFriends?pageNumber=1&pageSize=10")
            .respond({ data: [{ name: 'test1' }, { name: 'test2' }], totalItems: 2 });
               
        $scope.addToFriends({ id: 1 });

        $httpBackend.flush();       

        expect($scope.friends.length).toEqual(2);

        expect($scope.friendsPaginationData.totalItems).toEqual(2);
    });

    it("A friend is clicked and their chat history is retrieved", function () {
        //searching friends
        $httpBackend.expectGET("/api/user/getChatHistory?friendUserID=1&pageNumber=1&pageSize=10")
            .respond({ data: [{ message: 'test1' }, { message: 'test2' }], totalItems: 2 });

        var user = { id: 1, messageHistory: [] };
        $scope.myFriendClick(user);

        $httpBackend.flush();

        expect($scope.activeFriend).toBe(user);
        expect($scope.chatHistoryPaginationData.totalItems).toEqual(2);
        expect($scope.activeFriend.messageHistory.length).toEqual(2);
    });

    it("Should not call a friend as they are currently talking that same friend", function () {
        var friend = { id: 1 };
        var serverObj = spyOn($.connection.chatHub.server, 'sendTextMessage');
        var initVideoSpy = spyOn(window, "initializeBrowserVideo");

        $scope.activeCallUser = friend;

        $scope.callFriend(friend);

        expect(initVideoSpy).toHaveBeenCalled();
        expect(serverObj).not.toHaveBeenCalled();
    });

    it("Should not call a friend as they are currently talking to another friend and clicked cancel on confirmation message", function () {
        var friend = { id: 1 };
        var friend2 = { id: 2 };
        var confirmSpy = spyOn(window, 'confirm').andReturn(false);

        $scope.activeCallUser = friend;

        $scope.callFriend(friend2);

        expect(confirmSpy).toHaveBeenCalled();
        expect($scope.activeCallUser).toBe(friend);
    });

    it("Should call a friend after ending the call with current friend", function () {
        var friend = { id: 1 };
        var friend2 = { id: 2 };
        var confirmSpy = spyOn(window, 'confirm').andReturn(true);
        var signalrSpy = spyOn($.connection.chatHub.server, "callRequest");
        var endCallSpy = spyOn($scope, "endCall");
        
        $scope.activeCallUser = friend;

        $scope.callFriend(friend2);

        expect(confirmSpy).toHaveBeenCalled();
        expect(signalrSpy).toHaveBeenCalled();
        expect(endCallSpy).toHaveBeenCalled();
        expect($scope.activeCallUser).toBe(friend2);
    });

    it("Should end the call, and then callback the same user", function () {
        var endCallSpy = spyOn($scope, 'endCall');
        var startCallSpy = spyOn($scope, 'callFriend');

        $scope.activeFriend = {};

        $scope.callFriendRetry();

        expect(endCallSpy).toHaveBeenCalled();
        expect(startCallSpy).toHaveBeenCalledWith($scope.activeFriend);
    });

    it("Should remove a friend from My Friends list (user didn't confirm)", function () {
        var userToDelete = { id: 1 };
        var userToBePresent={ id: 2 };

        $scope.myFriends = [userToDelete, userToBePresent];
        
        expect($scope.myFriends.length).toEqual(2);

        //when the user clicks cancel, nothing should be removed
        spyOn(window, 'confirm').andReturn(false);
        $scope.removeFriend(userToDelete);
        expect($scope.myFriends.length).toEqual(2);                
    });

    it("Should remove a friend from My Friends list (confirmation failed)", function () {
        var userToDelete = { id: 1 };
        var userToBePresent = { id: 2 };

        $scope.myFriends = [userToDelete, userToBePresent];

        expect($scope.myFriends.length).toEqual(2);
             
        //when user confirms removal, only one item should remain after the AJAX call.
        spyOn(window, 'confirm').andReturn(true);

        //searching friends
        $httpBackend.expectDELETE("/api/user/removeFriend?friendUserID=1")
            .respond();

        $scope.removeFriend(userToDelete);

        $httpBackend.flush();

        expect($scope.myFriends.length).toEqual(1);
        expect($scope.myFriends.indexOf(userToBePresent)).toBe(0);
    });
    
    it("Should not send a text message (user didn't enter the message)", function () {
        var serverObj = spyOn($.connection.chatHub.server, 'sendTextMessage');
        //var jqCall = spyOn(jQuery.fn, 'find');
        
        spyOn(jQuery.fn, 'val').andReturn("");

        $scope.activeFriend = { messageHistory: [] };

        $scope.sendTextMessage();

        expect($scope.activeFriend.messageHistory.length).toEqual(0);
        expect($scope.textMessage).toBe(undefined);//textbox wasn't reset
        expect(serverObj).not.toHaveBeenCalled()
    });

    it("Should send a text message", function () {
        var message = "msg";
        
        //var serverObj = jasmine.createSpyObj("$.connection.chatHub.server", ["sendTextMessage"]);
        var serverObj = spyOn($.connection.chatHub.server, 'sendTextMessage');
        var scrollSpy = spyOn($.fn, "scrollTop");

        spyOn(jQuery.fn, 'val').andReturn(message);
        
        $scope.activeFriend = { id: 1, messageHistory: [] };
        $scope.textMessage = message;

        $httpBackend.expectPOST("/api/user/postTextMessage", {
            friendUserID: 1,
            message: message
        }).respond();
                      
        $scope.sendTextMessage();

        $httpBackend.flush();

        expect(serverObj).toHaveBeenCalledWith($scope.activeFriend.id, message);
        expect($scope.textMessage).toBe("");
        expect(scrollSpy).toHaveBeenCalled();
    });

    it("Should trigger My Friends search in order to reload the list when My Friends tab is clicked", function () {
        var spy = spyOn($scope, "findMyFriends");

        $scope.friendsTabClick(1);

        expect(spy).toHaveBeenCalled();
        expect($scope.selectedTab).toEqual(1);
    });

    it("Should send a call termination request to other party and show the toast", function () {
        var serverObj = spyOn($.connection.chatHub.server, 'callTerminated');
        var toastrSpy = spyOn(toastr, "info");

        window.existingCall = { close: function () { } };
        $scope.activeCallUser = { id: 1 };

        $scope.endCall();
              
        expect(serverObj).toHaveBeenCalled();
        expect(toastrSpy).toHaveBeenCalled();//only should be shown if window.existingCall is set
        
        expect($scope.activeCallUser).toBe(null);
    });

    it("Should send a call termination request to other party and not show the toast", function () {
        var serverObj = spyOn($.connection.chatHub.server, 'callTerminated');
        var toastrSpy = spyOn(toastr, "info");

        window.existingCall = undefined;
        $scope.activeCallUser = { id: 1 };

        $scope.endCall();

        expect(serverObj).toHaveBeenCalled();
        expect(toastrSpy).not.toHaveBeenCalled();//only should be shown if window.existingCall is set

        expect($scope.activeCallUser).toBe(null);
    });

    it("Should not send a call termination request to other party", function () {
        var serverObj = spyOn($.connection.chatHub.server, 'callTerminated');
        var toastrSpy = spyOn(toastr, "info");
               
        $scope.activeCallUser = null;

        $scope.endCall();
        
        expect(serverObj).not.toHaveBeenCalled();
        expect(toastrSpy).not.toHaveBeenCalled();

        expect($scope.activeCallUser).toBe(null);
    });

    it("Should terminate a call when a call end request comes in", function () {
      
        var spyEndCall = spyOn($scope, "endCall");

        $.connection.chatHub.client.callEndRequest();        

        expect(spyEndCall).toHaveBeenCalled();
    });

});
