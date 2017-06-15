//(function() {
"use strict";

angular.module('masonry', ['ng'])
    .directive('masonry', function ($parse) {
        return {
            restrict: 'AC',
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

                var container = $element[0];
                var options = angular.extend({
                    itemSelector: '.item'
                }, JSON.parse($attrs.masonry));

                $scope.masonry = new Masonry(container, options);

                console.log('Hello from the controller.');

//                this.reload = function (tile) {
//                    console.log('Write to log called by', tile);
//                    $scope.masonry.reloadItems();
//                    $scope.masonry.layout();
//                };

                this.reload = _.debounce(function(tile){
                    console.log('Write to log called by', tile);
                    $scope.masonry.reloadItems();
                    $scope.masonry.layout();
                }, 100);

            }]
        };
    })
    .directive('masonryTile', function () {
        return {
            restrict: 'AC',
            require: '^masonry',
            link: function (scope, elem, attrs, ctrl) {
                var master = elem.parent('*[masonry]:first').scope();
                var masonry = master.masonry;

                elem.ready(function () {
                    //masonry.addItems([elem]);
//                    masonry.reloadItems();
//                    masonry.layout();
                });

//                scope.$on('$destroy', console.log('masonryTile DESTROYED!!', scope));
                scope.$on('$destroy', ctrl.reload('masonryTile'));
            }
        };
    })
    .directive('masonryTestTile', function () {
        return {
            restrict: 'E',
            require: '^masonry',
            replace: true,
            template: '<div class="tile one-by-one"><div>{{ item.title }}</div></div>',
            link: function (scope, elem, attrs, ctrl) {
                var master = elem.parent('*[masonry]:first').scope();
                var masonry = master.masonry;

                elem.ready(function () {
                    //masonry.addItems([elem]);
//                    masonry.reloadItems();
//                    masonry.layout();
                });


//                scope.$on('$destroy', console.log('masonryTestTile DESTROYED!!', scope));
                scope.$on('$destroy', ctrl.reload('masonryTestTile'));


            }
        };
    })

;
//})();