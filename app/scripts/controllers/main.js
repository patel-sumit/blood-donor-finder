/**
 * Created by Sumit Patel on 02/01/2017.
 */
angular.module('bloodDonorFinderApp')
/*.controller('MainCtrl', function ($rootScope, $state, LoginService, UserService) {*/
    .controller('MainCtrl', ['UserService','$location','$scope','$rootScope','$state','NgMap','$timeout','$window',function (UserService,$location,$scope,$rootScope,$state,NgMap,$timeout,$window) {

        $scope.map=NgMap;
        $scope.init = function (map) {
            var options = {
                enableHighAccuracy: true
            };
            navigator.geolocation.getCurrentPosition(function(pos) {
                $scope.position ={};
                $scope.position.latt=pos.coords.latitude;
                $scope.position.longi=pos.coords.longitude;
                },
                function(error) {
                    /*alert('Unable to get location: ' + error.message);*/
                }, options);

            $rootScope.online = navigator.onLine;
            $window.addEventListener("offline", function () {
                $rootScope.$apply(function() {
                    $rootScope.online = false;
                });
            }, false);
            $window.addEventListener("online", function () {
                $rootScope.$apply(function() {
                    $rootScope.online = true;
                });
            }, false);

        };
    var main = this;
    function logout() {
        main.currentUser = UserService.setCurrentUser(null);
        $state.go('login');
        /*LoginService.logout()
            .then(function(response) {
                main.currentUser = UserService.setCurrentUser(null);
                $state.go('login');
            }, function(error) {
                console.log(error);
            });*/
    }
    $rootScope.$on('authorized', function() {
        main.currentUser = UserService.getCurrentUser();
    });
    $rootScope.$on('unauthorized', function() {
        main.currentUser = UserService.setCurrentUser(null);
        $state.go('login');
    });
    main.logout = logout;
    main.currentUser = UserService.getCurrentUser();

  
}])