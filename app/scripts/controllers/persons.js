/**
 * Created by Sumit Patel on 03/01/2017.
 */
angular.module('bloodDonorFinderApp')
    .controller('PersonsCtrl', ['UserService','$stateParams','$scope','$timeout','NgMap','$rootScope',function (UserService,$stateParams,$scope,$timeout,NgMap,$rootScope) {
        var vm=this;
        vm.currentUser = UserService.getCurrentUser();
        vm.Users=[];
        vm.getUsers=getUsers($stateParams.bloodgroup,vm.currentUser.uid);
        vm.map=NgMap;
        function getUsers(bgroup,userId){
            if($rootScope.online ){
                UserService.getUsersbyBloodgroup(bgroup,userId)
                    .then(function (response) {
                        vm.Users=response;
                        $scope.$apply();
                    });

            }else{
                UserService.getUsersbyBloodgroupOffline(bgroup,userId)
                    .then(function (response) {
                        vm.Users=response;
                        $scope.$apply();

                    });
            }

        }
        var map;
        vm.pinClicked = function(user,NgMap) {
            window.scrollTo(0,document.body.scrollHeight);
            NgMap.getMap({id:"map"}).then(function(map) {
                var latlng = new google.maps.LatLng(user.latt, user.longi);
                map.setCenter(latlng);
                map.setZoom(5);
                window.map = map;
            });
            $scope.setCenter = function(latlng){
                window.map.setCenter(new google.maps.LatLng(latlng) );
            }
        }
    }]);