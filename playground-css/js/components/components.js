angular.module('components', [])
//    .directive('isotope', function ($timeout) {
//        return {
////            priority:'1',
//            restrict: 'A',
////            require:'tile',
//            scope: {
//                items: '=data'
//            },
////            templateUrl: 'components/tile.html',
//            link: function (scope, element, attrs) {
//
//                // isotope options
//                var options = {
//                    masonry: {
//                        columnWidth: 120
////                        gutterWidth: 30
//                    },
//                    animationEngine: 'css',
////                itemSelector: 'article',
//                    itemSelector: '.tile',
////                layoutMode: 'fitRows',
//                    sortAscending: true
//                };
//
//                // init isotope with options
//                element.isotope(options);
//
//                // the $timeout function is a hack.
//                // it helps to detect when the dom is loaded.
//                scope.$watch('items', function (newVal, oldVal) {
//                    $timeout(function () {
//                        element.isotope('reloadItems').isotope({ sortBy: 'original-order' });
//                    }, 0);
//                }, true);
//
//            }
//        };
//    })
//    .controller('isotopeCtrl', function ItemsCtrl($scope, $timeout, mockTileService) {
//
//        console.log(mockTileService);
////        $scope.collection = mockTileService.getRandom();
//
//        $scope.collection = [
//            {title:'tile1', order:1, size:'1,1'},
//            {title:'tile2', order:2, size:'1,1'}
//        ]
//
//
//        $scope.addTile = function (cssSize) {
//            $scope.collection.push({title:'new', order:2, size:'1,1'});
//        }
//
//
//    })
    .directive('comSwatch', function () {
        return{
            restrict: 'E',
            templateUrl: 'components/swatch.html',
            scope: {
                swatchName: '@name'
            }
        }
    })
//    .directive('tile', function () {
//        return{
////            priority:'0',
//            restrict: 'E',
//            replace:true,
//            require:'^isotope',
//            templateUrl: 'components/tile.html',
//            scope: {
//                title: '@title'
//            }
//
//        }
//    })
    .directive('isotopeContainer', function () {
        return{
            restrict: 'A',
            controller: function ($scope) {
                $scope.name = 'isotopeContainer controller';
            },
            link: function (scope, element, attrs) {


            }
        }
    })
    .directive('isotopeEditor', function () {
        return{
            restrict: 'E',
            require: '^isotope',
            scope:{},
            templateUrl: 'components/isotope-editor.html',
            link: function (scope, element, attrs, ctrl) {
                scope.addTile = function(){
                    console.log('Add Tile');
                }
            }
        }
    })
;