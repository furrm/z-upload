"use strict";

angular.module('components-common', [])
    .directive('aoOffCanvas', function () {
        return{
            restrict: 'C',
            templateUrl: 'templates/components/common/off-canvas.html',
            replace: true,
            link: function (scope, elem) {

                scope.$watch('isOpen', function (newVal, oldVal) {
                    if (newVal) {
                        elem.addClass('sidebar-open');
                    }
                    else {
                        elem.removeClass('sidebar-open')
                    }
                });

            },
            controller: function ($scope) {

                $scope.toggleMenuState = function (command) {
                    if (command === 'close') {
                        $scope.isOpen = false;
                    }
                    else {
                        $scope.isOpen = true;
                    }

                }
            }
        }
    })
    .directive('aoOffCanvasSidebar', function () {
        return{
            restrict: 'C',
            templateUrl: 'templates/components/common/ao-off-canvas-sidebar.html',
            replace: true
        }
    })
    .directive('aoOffCanvasContent', function () {
        return{
            restrict: 'C',
            templateUrl: 'templates/components/common/ao-off-canvas-content.html',
            replace: true
        }
    })
    .directive('signIn', function () {
        return{
            restrict:'AE',
            templateUrl:'templates/components/common/sign-in.html' ,
            replace:true
        }
    })
;