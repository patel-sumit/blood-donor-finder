/**
 * Created by Sumit Patel on 30/12/2016.
 */
angular.module('bloodDonorFinderApp')
    .controller('LoginCtrl', ['UserService','$location','$scope','$rootScope','$state',function (UserService,$location,$scope,$rootScope,$state) {
        $scope.$on('$viewContentLoaded', function(){
            UserService.displayFloatingLabel();
        });

        var vm = this;
        vm.login = login;
        $scope.errorMessage;
        function login() {
            /*vm.dataLoading = true;*/
            var currentUser=null;
            UserService.Authenticate(vm)
                .then(function (response) {
                    if (response.username) {
                        /*FlashService.Success('Registration successful', true);*/

                         currentUser= {
                            username: response.username,
                                email:response.email,
                                uid: response.uid
                        }

                        $state.go('home');                      

                    } else {
                        /*FlashService.Error(response.message);*/
                        /*vm.dataLoading = false;*/

                        $scope.errorMessage=response;
                        $scope.$apply();

                    }
                    UserService.setCurrentUser(currentUser);
                    $rootScope.$broadcast('authorized');
                });

        }
    }
    ]);





