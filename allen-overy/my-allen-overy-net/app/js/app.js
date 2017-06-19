'use strict';


// Declare app level module which depends on filters, and services
//angular.module('landingApp', [
//  'ngRoute',
//  'landingApp.filters',
//  'landingApp.services',
//  'landingApp.directives',
//  'landingApp.controllers'
//]).

var landingApp = angular.module('landingApp', [
    'ngRoute',
    'ngCookies',
    'ngResource',
    'angular-contentful'
]);

landingApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/CountryPicker', {templateUrl: 'partials/CountryPicker.html', controller: 'CountryPickerCtrl'});
  $routeProvider.otherwise({redirectTo: '/CountryPicker'});
}]);

landingApp.run(function(contentfulConfig, helperService){
    contentfulConfig.spaceId = "8u2cofzt5au2";
    contentfulConfig.accessToken = "2e7c6010bb1c87d6e0714e178c464c99719e3d55d4015d71cb723b58a156bd2b";
    helperService.version = 1;
});
