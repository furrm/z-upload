"use strict";

angular.module('app', [])
    .controller('ItemsCtrl', function ($scope) {
        $scope.name = 'ItemsCtrl';

        $scope.add = function(size){

            var order = $scope.items.length + 1;

            $scope.items.push(
                {id: 1, order:order, title: size, class:size}
            )
            $scope.$broadcast('postAdded');

        }

        $scope.refresh = function(){
            $scope.$broadcast('refresh');
        }

            $scope.items = [
//            {id: 1, title: 'one', class:'one-by-one'},
//            {id: 2, title: 'two', class:'one-by-one'},
//            {id: 3, title: 'three', class:'one-by-one'}
        ];
    })
    .directive('isotope', function ($timeout) {
        return {
            scope:{
                tiles: '=tiles'
            },
            link: function (scope, element, attrs) {

                scope.$on('postAdded', function(){
                    $timeout(function(){
                        element.isotope( 'reloadItems' ).isotope({ sortBy: 'original-order' });
                        console.log('postadded:element.isotope', element.isotope( 'reloadItems' ));
                    })
                })

                scope.$on('refresh', function(){
                    $timeout(function(){
                        element.isotope( 'reloadItems' );
                    })
                })


            }
        };
    })
.directive('tile', function(){
        return{
            restrict:'E',
            replace:true,
            templateUrl:'tile.html'
        }
    })
;