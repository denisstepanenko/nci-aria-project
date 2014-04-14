describe("chatterApp: Application level testing", function () {
    beforeEach(module('ui.bootstrap'));
    beforeEach(module('controllers'));
    beforeEach(module('chatterApp'));


    var $scope, ctrl, $httpBackend, http, $log;

    beforeEach(
        inject(function ($rootScope, $chatterApp, _$httpBackend_, $http, _$log_) {
            $scope = $rootScope.$new();

            $httpBackend = _$httpBackend_;

            $log = _$log_;

            ctrl = $chatterApp('chatterApp', {
                $rootScope: $rootScope,
                $location: $location,
                $http: $http,
            });

        }));

    //it("Should handle Google Auth Success event", inject(function ($rootScope, $chatterApp) {
    //    var successLoginArgs = {
    //        status: { google_logged_in: true },
    //        access_token: "123345456hdfgh"
    //    };
    //    var responseData = { userId: 1 };

    //    $httpBackend.expectGET("/api/auth/GetUserId?authType=1&accessToken=" & successLoginArgs.access_token)
    //        .respond(responseData);

    //    $rootScope.$broadcast('event:google-plus-auth-success',  successLoginArgs);

    //    $httpBackend.flush();

    //    expect($rootScope.loggedOn).toEqual(true);
    //    expect($rootScope.userInfo).toEqual(responseData);

    //    //testing when something goes wrong with the AJAX call
    //    $httpBackend.expectGET("/api/auth/GetUserId?authType=1&accessToken=" & successLoginArgs.access_token)
    //        .respond(500);

    //    $rootScope.$broadcast('event:google-plus-auth-success', successLoginArgs);

    //    $httpBackend.flush();

    //    expect($rootScope.loggedOn).toEqual(false);
    //    expect($rootScope.userInfo).toEqual({});
    //}));

    //it("Should handle Google Auth Failed event", inject(function ($rootScope, $chatterApp) {
     
    //    $rootScope.$broadcast('event:google-plus-auth-failure');
             
    //    expect($rootScope.loggedOn).toEqual(false);
    //    expect($rootScope.userInfo).toEqual({});
    //}));

});
