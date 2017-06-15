'use strict';

angular.module('app.components', [])
    .directive('offcanvasmenu', function () {
        return{
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {menuState: '='},
            templateUrl: 'templates/off-canvas-menu.html',
            link: function (scope, element, attrs, controller) {

//                var inactiveCssClass = 'slide-menu slide-menu-vertical slide-menu-left';
                var inactiveCssClass = 'slide-menu slide-menu-vertical slide-menu-left slide-menu-open';  // force open for dev
                var activeCssClass = 'slide-menu slide-menu-vertical slide-menu-left slide-menu-open';


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
    })
    .directive('offCanvas', function () {
        return{
            restrict: 'E',
            templateUrl: 'templates/components/off-canvas.html',
            controller: 'AppCtrl',
            transclude: true,
            replace: true
        }
    })
    .directive('menuSide', function () {
        return{
            restrict: 'E',
            templateUrl: 'templates/components/menu/menu-side.html'
//            controller:function(){
//                this.doSomething = function(){
//                    alert('Doing Something =)');
//                };
//            }
        }
    })
    .directive('menuHeader', function () {
        return{
            restrict: 'E',
            templateUrl: 'templates/components/menu/menu-header.html'
        }
    })
    .directive('menuTop', function () {
        return{
            scope:true,
            restrict: 'E',
            templateUrl: 'templates/components/menu/menu-top.html',
            require:'^offCanvas'

//            controller:function(){
//                this.doSomething = function(){
//                    alert('Doing Something =)');
//                };
//            }
        }
    })
    .directive('menuSearch',function () {
        return{
            restrict: 'E',
            templateUrl: 'templates/components/menu/menu-search.html'
        }
    }).directive('menuSearchResults',function () {
        return{
            restrict: 'E',
            templateUrl: 'templates/components/menu/menu-search-results.html',
            controller: '@',
            name: 'ctrl'
//            require: '^offCanvas',  // use the offCanvas controller
//            link: function (scope, element, attribute, offCanvasCtrl) {
//
////                scope.switch = function (args) {
////                    offCanvasCtrl.switchMatter(args);
////                }

            }


    })

;
