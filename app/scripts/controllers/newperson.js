/**
 * Created by Sumit Patel on 03/01/2017.
 */
angular.module('bloodDonorFinderApp')
    .controller('NewPersonCtrl', ['UserService','$scope','$filter','$state',function (UserService,$scope,$filter,$state) {
        var vm = this;
        vm.nePerson = nePerson;
        function nePerson() {
            /*vm.dataLoading = true;*/
            UserService.addNewPerson(vm)
                .then(function (response) {
                    if (response=="success") {
                        alert('Person added successfully!');
                        /*FlashService.Success('Registration successful', true);*/
                        $scope.$apply( function () {
                            $state.go('home');
                        } );
                    } else {
                        /*FlashService.Error(response.message);*/
                        /*vm.dataLoading = false;*/
                    }
                });
        }
        
    }])