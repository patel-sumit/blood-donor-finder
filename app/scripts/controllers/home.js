/**
 * Created by Sumit Patel on 01/01/2017.
 */
angular.module('bloodDonorFinderApp')
    .controller('HomeCtrl', ['UserService','$location','$scope','$rootScope',function (UserService,$location,$scope,$rootScope) {
        var vm = this;
        $scope.currentUser =UserService.currentUser;
    }]);