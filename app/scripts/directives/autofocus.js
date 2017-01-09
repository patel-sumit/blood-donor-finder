/**
 * Created by Sumit Patel on 08/01/2017.
 */
angular.module('bloodDonorFinderApp')
.directive('autofocus', ['$timeout', function($timeout) {
    return {
        link: function ( scope, element, attrs ) {
            $timeout( function () { element[0].focus(); },100 );
        }
    };
}]);