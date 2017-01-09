/**
 * Created by Sumit Patel on 30/12/2016.
 */
angular.module('bloodDonorFinderApp')
    .controller('RegisterCtrl', ['UserService','$state','$scope','$rootScope',function (UserService,$state,$scope,$rootScope) {
      /*  $scope.share = ShareObject;*/
        var vm = this;
        $scope.errorMessage;
         vm.register = register;
        vm.position={}
        vm.position.latt=null;
        vm.position.longi=null;
        function register() {
            if($scope.position){

                UserService.setLocation($scope.position);
                vm.position=$scope.position;
            }

            /*vm.dataLoading = true;*/
            UserService.Create(vm)
                .then(function (response) {
                    if (response=="success") {
                        /*FlashService.Success('Registration successful', true);*/
                       /* $scope.$apply( function () {
                            $location.path('/login');
                        } );*/
                        $state.go('login');
                    } else {
                        /*FlashService.Error(response.message);*/
                        /*vm.dataLoading = false;*/
                        $scope.errorMessage=response;
                        $scope.$apply();
                    }
                });
        }
    }
]);


