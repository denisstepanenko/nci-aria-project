describe("LoginController", function () {
    beforeEach(module('ui.bootstrap'));
    beforeEach(module('controllers'));
    beforeEach(module('chatterApp'));


    var $scope, ctrl, $httpBackend, http, $log;

    beforeEach(
        inject(function ($rootScope, $controller, _$httpBackend_, $http, _$log_) {
            $scope = $rootScope.$new();

            $httpBackend = _$httpBackend_;

            $log = _$log_;
            
            ctrl = $controller('LoginCtrl', {
                $rootScope: $rootScope,
                $scope: $scope,
                $http: $http,
                $log: $log
            });

        }));

    it("Should handle Google Auth Success event", inject(function ($rootScope, $controller) {
        var successLoginArgs = {
            status: { google_logged_in: true },
            access_token: "123345456hdfgh"
        };
        var responseData = { userId: 1 };

        $httpBackend.expectGET("/api/auth/GetUserId?authType=1&accessToken=" & successLoginArgs.access_token)
            .respond(responseData);

        $scope.$broadcast('event:google-plus-auth-success',  successLoginArgs);

        $httpBackend.flush();

        expect($rootScope.loggedOn).toEqual(true);
        expect($rootScope.userInfo).toEqual(responseData);

        //testing when something goes wrong with the AJAX call
        $httpBackend.expectGET("/api/auth/GetUserId?authType=1&accessToken=" & successLoginArgs.access_token)
            .respond(500);

        $scope.$broadcast('event:google-plus-auth-success', successLoginArgs);

        $httpBackend.flush();

        expect($rootScope.loggedOn).toEqual(false);
        expect($rootScope.userInfo).toEqual({});
    }));

    it("Should handle Google Auth Failed event", inject(function ($rootScope, $controller) {
     
        $scope.$broadcast('event:google-plus-auth-failure');
             
        expect($rootScope.loggedOn).toEqual(false);
        expect($rootScope.userInfo).toEqual({});
    }));

});
