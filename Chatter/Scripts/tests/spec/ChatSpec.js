describe("ChatController", function () {
    beforeEach(module('ui.bootstrap'));
    beforeEach(module('controllers'));
    beforeEach(module('chatterApp'));


    var $scope, ctrl, $httpBackend, http;

    beforeEach(
        inject(function ($rootScope, $controller, _$httpBackend_, $http) {
            $scope = $rootScope.$new();
            $scope.friendSearchCriteria = 'test';
            $scope.friendsPaginationData = { totalItems: 1 };
            $httpBackend = _$httpBackend_;

            $httpBackend.when("GET", "/api/user/FindFriends?pageNumber=1&pageSize=10&searchCriteria=test")
                .respond({ data: [{name: 'friend1'}, {name: 'friend2'}]});

            ctrl = $controller('ChatCtrl', {
                $scope: $scope,
                $http: $http,
                $log: null
            });
            
    }));

    it("Get Friends", function () {
        $scope.findFriends();
        $httpBackend.flush();
        expect($scope.friends.length).toEqual(2);
    });

});
