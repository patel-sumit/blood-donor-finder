/**
 * Created by Sumit Patel on 01/01/2017.
 */
angular.module('bloodDonorFinderApp')

    .controller('MenuCtrl', ['UserService','$location','$scope','$rootScope',function (UserService,$location,$scope,$rootScope) {
        var vm=this;
        $scope.navClass = function (page) {
            var currentRoute = $location.path().substring(1) || 'login';
            return page === currentRoute ? 'active' : '';
        };
    }]);