/**
 * Created with JetBrains WebStorm.
 * User: furrm
 * Date: 28/08/2013
 * Time: 06:54
 * To change this template use File | Settings | File Templates.
 */

'use strict';

angular.module('app.components', [])
    .directive('offcanvasmenu',function () {
        return{
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {menuState: '='},
            templateUrl: 'templates/off-canvas-menu.html',
            link: function (scope, element, attrs, controller) {

                var inactiveCssClass = 'k-menu k-menu-vertical k-menu-left';
                var activeCssClass = 'k-menu k-menu-vertical k-menu-left k-menu-open';


                //set initial state.
                attrs.$set('class', inactiveCssClass);

                scope.$watch('menuState', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        //alert('You changed the menuState from ' + oldVal + ' to ' + newVal);

                        if (newVal === true)
                            attrs.$set('class', activeCssClass)
                        else {
                            attrs.$set('class', inactiveCssClass)

                        }
                    }
                });


            },
            controller: function ($scope) {
                $scope.toggleMe = function () {
                    alert('Hello!!');

                }
            }


        };
    }).directive('offCanvas', function () {
        return{
            restrict: 'E',
            templateUrl: 'templates/off-canvas.html',
            controller: function ($scope) {


                var menuOpenCssClass = 'k-menu k-menu-vertical k-menu-left k-menu-open';
                var menuCloseCssClass = 'k-menu k-menu-vertical k-menu-left';

                var mainOpenCssClass = 'k-main-push k-main-push-toright'
                var mainCloseCssClass = 'k-main-push'

                var menuIsOpen = 0;

                $scope.menuCss = menuCloseCssClass;
                $scope.mainCss = mainCloseCssClass;

                $scope.toggleMenuState = function(){

                    if(menuIsOpen) // then close it...
                    {
//                       alert('Close the menu...');
                        $scope.menuCss = menuCloseCssClass;
                        $scope.mainCss = mainCloseCssClass;
                    }   else // then open it
                    {
//                        alert('Open the menu...');
                        $scope.menuCss = menuOpenCssClass;
                        $scope.mainCss = mainOpenCssClass;

                    }

                    menuIsOpen = !menuIsOpen;

                }

            },
            transclude: true,
            replace: true
        }
    });