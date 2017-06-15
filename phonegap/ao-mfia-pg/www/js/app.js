"use strict";

angular.module('mfia', [
        'ngRoute',
        'services-common',
        'services-data',
        'components-common',
        'components-finance',
        'components-lookups'
    ]).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: 'templates/content/main.html'
            })
            .when('/signin', {
                templateUrl: 'templates/content/sign-in.html'

            })
            .when('/reports', {
                templateUrl: 'templates/content/reports.html'
            })
            .when('/finance-report', {
                templateUrl: 'templates/content/finance-report.html'
            })
            .otherwise({redirectTo: '/main'});
    }])
    .controller('AppCtrl', function ($scope, applicationStateMgr) {
        $scope.name = 'AppCtrl';

        $scope.applicationStateMgr = applicationStateMgr;



        $scope.signIn = function (username) {
            applicationStateMgr.manager.signInUser(username);
        }

        $scope.signOut = function () {
            applicationStateMgr.manager.signOutUser();

        };

        $scope.selectReport = function(reportName){
            applicationStateMgr.manager.selectedReport.status = reportName;
        }

        $scope.matterIsSelected = applicationStateMgr.manager.selectedMatter.matterIsSelected;
    })
;