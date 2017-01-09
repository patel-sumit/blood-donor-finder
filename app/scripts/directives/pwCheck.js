/**
 * Created by Sumit Patel on 01/01/2017.
 */
angular.module('bloodDonorFinderApp')
    .directive('pwCheck', function() {
            return {
                require: 'ngModel',
                scope:true,
                link: function(scope, elm, attrs, ctrl) {
                    var checker = function () {

                        //get the value of the first password
                        var e1 = scope.$eval(attrs.ngModel);

                        //get the value of the other password
                        var e2 = scope.$eval(attrs.pwCheck);
                        
                        return e1 == e2;
                    };
                    scope.$watch(checker, function (n) {

                        //set the form control to valid if both
                        //passwords are the same, else invalid
                        ctrl.$setValidity("unique", n);
                    });
                }
            }
});