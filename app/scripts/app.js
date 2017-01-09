'use strict';

/**
 * @ngdoc overview
 * @name corporateDashboardApp
 * @description
 * # corporateDashboardApp
 *
 * Main module of the application.
 */
angular
  .module('bloodDonorFinderApp', ['ui.router','angular-storage','ngMap'])
    .config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider,$locationProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl as vm'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl as vm'
            })
            .state('bloodgroup', {
                url: '/bloodgroup',
                templateUrl: 'views/bloodgroup.html',
                controller: 'BloodGroupCtrl as vm'
            })
            .state('persons', {
                url: '/persons/:bloodgroup',
                templateUrl: 'views/persons.html',
                controller: 'PersonsCtrl as vm'
            })
            .state('data', {
                url: '/data',
                templateUrl: 'views/data.html',
                controller: 'DataCtrl as vm'
            })
            .state('newperson', {
                url: '/newperson',
                templateUrl: 'views/newperson.html',
                controller: 'NewPersonCtrl as vm'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl as vm'
            });

    }])
   /*.run(function($window, $rootScope) {
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
 });*/


