'use strict';

angular.module('app', ['app.finance.controllers', 'app.components'])
    .controller('AppCtrl', function ($scope) {
        $scope.name = 'App Controller';
//        $scope.bodyClass = "cbp-spmenu k-menu-vertical kr-menu-left";
        var body = document.querySelector('body');
        var menu = document.querySelector('#cbp-spmenu-s1');

        $scope.menuState = 0;

        $scope.toggleMenu = function () {
            if (!$scope.menuState) {
                angular.element(body).addClass('cbp-spmenu-push-toright');
                angular.element(menu).addClass('k-menu-open');
                $scope.menuState = 1;
            } else {
                angular.element(body).removeClass('cbp-spmenu-push-toright');
                angular.element(menu).removeClass('k-menu-open');
                $scope.menuState = 0;
            }


        };
    });