"use strict";
angular.module('directives', [])
    .directive('map', function () {
        return{
            scope: {
                question: '@',
                section: '@',
                menuItems: '=',
                transform:'@'
            },
            restrict: 'E',
            templateUrl: 'components/map.html',
            link: function (scope, elem, attrs, ctrl) {

                console.log('map directive:', scope.section); // todo: delete me
                console.log('map directive:', scope.transform); // todo: delete me

                scope.$watch('transform', function(oldVal, newVal){
                    console.log('map directive:', scope.transform); // todo: delete me

                })

            }
        }
    })
    .directive('mapImage', function(){
            return{
//                scope:{
//                    matrixString:'='
//                },
                restrict:'E',
                templateUrl:'components/map-image.html',
                link: function (scope, elem, attrs, ctrl) {

                }
            }
        })
    .directive('regionSelector', function ($rootScope) {
        return{
            scope: {
                section: '@',
                menuItems: '='
            },
            restrict: 'E',
            templateUrl: 'components/region-selector.html',
            link: function (scope, elem, attrs, ctrl) {

                // listen for the region-selected event from the region directive
                scope.$on('region-selected', function (event, item) {

                    console.log("regionSelector", scope.section, event, item); // todo: delete me

                    // depending on what section is firing the event, raise the appropriate matrix event
                    // not happy with this implementation, but will do for prototype

                    if (scope.section === "materialAdverseChangePart1") {

                        // broadcast the appropriate event for the section.
                        $rootScope.$broadcast("materialAdverseChangePart1-region-selected", item);
                        $rootScope.$emit("materialAdverseChangePart1-region-selected", item);

                        $rootScope.$broadcast("matrix-changed", item.MaterialAdverseChange.transform);
                        $rootScope.$emit("matrix-changed", item.MaterialAdverseChange.transform);
                    }

                });
            }
        }
    })
    .directive('region', function ($rootScope) {
        return{
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {

                scope.regionSelected = function (item) {

                    console.log("region directive regionSelected", item.uid); // todo: delete me

                    // broadcast that a specific region has been selected.
                    $rootScope.$broadcast("region-selected", item);
                    $rootScope.$emit("region-selected", item);



                }
            }

        }
    })
    .directive('cssMatrixCreator', function () {
        return{
            restrict: 'E',
            templateUrl: 'components/css-matrix-creator.html'
        }
    })
    .directive('matrix', function ($rootScope, $timeout) {
        return{
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {



                scope.matrix = { 'a': 10, b: 0, c: 0, d: 10, e: 0, f: 0 };

                scope.matrixObjectStringIn = "";


                scope.zoom = 10;

                scope.reset = function () {

                    scope.matrix.a = 10;
                    scope.matrix.b = 0;
                    scope.matrix.c = 0;
                    scope.matrix.d = 10;
                    scope.matrix.e = 0;
                    scope.matrix.f = 0;

                    scope.zoom = 10;

                }


                var timeoutId = null;

                scope.$watch('zoom', function (newVal, oldVal) {

//                    console.log("zoom newVal", newVal); // todo: delete me

                    scope.matrix.a = newVal;
                    scope.matrix.d = newVal;

                });

                scope.$watch('matrixObjectStringIn', function(newVal,oldVal){

                    if(newVal !== oldVal) {
                        scope.matrix = JSON.parse(newVal);
                    }

                });

                scope.$watchCollection('matrix', function (newVal, oldVal) {

//                    console.log(scope.matrix); // todo: delete me


                    if(newVal !== oldVal) {

                        registerChange();

                        $rootScope.$broadcast("matrix-changed", newVal);
                    }

                });




                scope.$on('matrix-selected', function (event, args) {


                    scope.matrix = args;


                });


                function registerChange() {

                    if (timeoutId !== null) {

                        return;
                    }

                    timeoutId = $timeout(function () {


                        $timeout.cancel(timeoutId);
                        timeoutId = null;

                        // Now load data from server
                    }, 1000);
                }


            }
        }
    })
    .directive('matrixElement', function () {
        return{

            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {

                scope.matrix = { 'a': 10, b: 0, c: 0, d: 10, e: 0, f: 0 };
                scope.matrixObjectStringOut = JSON.stringify(scope.matrix);
                scope.matrixString = matrixStringBuilder(scope.matrix);


                scope.$on('matrix-changed', function (event, args) {

                    console.log("matrix-changed:"); // todo: delete me

                    scope.matrix = args;

                    scope.matrixObjectStringOut = JSON.stringify(args);

                    scope.matrixString = matrixStringBuilder(args);

//                    elem.css('-webkit-transform',matrixStringBuilder(args));

                });

//                scope.$watch('matrixObjectString', function(oldVal,newVal){
//
//                    scope.matrix = JSON.parse(newVal);
//
//                });

//                scope.$on('matrix-selected', function (event, args) {
//
//                    console.log("matrix-selected:"); // todo: delete me
//
//                    scope.matrix = args;
//
//                    scope.matrixObjectString = JSON.stringify(args);
//
//                    scope.matrixString = matrixStringBuilder(args);
//
//                });


                scope.$on('matrix-reset', function (event, args) {

                    scope.matrix = args;

                });

                function matrixStringBuilder(val) {

                    return "matrix("
                        + val.a / 10 + ","
                        + val.b + ","
                        + val.c + ","
                        + val.d / 10 + ","
                        + val.e + ","
                        + val.f + ");";

                }


//                scope.$watchCollection("matrix", function (newVal, oldVal) {
//                    console.log("MATRIX HAS CHANGED"); // todo: delete me
//                });


            }
        }
    })
    .directive('itemReset', function(){
        return{
            restrict:'E',
            replace:true,
            templateUrl:'components/item-reset.html'
        }
    })
    .directive('itemQuestion', function(){
        return{
            restrict:'E',
            replace:true,
            templateUrl:'components/item-question.html'
        }
    })
;