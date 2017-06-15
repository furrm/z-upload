angular.module('isoTest', [])
//    .directive('isotope', function ($timeout) {
//        return {
//            restrict: 'A',
//            scope: {
//                items: '=data'
//            },
//            templateUrl: 'components/tile.html',
//            link: function (scope, element, attrs) {
//
//                // isotope options
//                var options = {
//                    masonry: {
//                        columnWidth: 120,
//                        gutterWidth: 30
//                    },
//                    animationEngine: 'css',
////                itemSelector: 'article',
//                    itemSelector: '.element',
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

//    .service('mockTileService', function ($http) {
//        return {
//            get: function () {
//
//                // generate random data
//                var randomItems = [];
//                for (var i = 0; i < 10; i++) {
//
//                    var id = Math.floor(Math.random() * 101);
//
//                    randomItems.push({
//                        id: id,
//                        title: "Item " + id
//                    });
//                }
//
//                return randomItems;
//            }
//        };
//    })
;

