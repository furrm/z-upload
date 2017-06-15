//(function() {
"use strict";

angular.module('masonry', ['ng'])
    .directive('masonry', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                console.log('masonry scope', scope); // DEBUG
                console.log('masonry attrs', attrs); // DEBUG
                console.log('masonry attrs - masonryitems', attrs.masonryItems); // DEBUG
                console.log('masonry attrs - masonryitems', scope.masonryItems); // DEBUG



                var container = elem[0];
                var options = angular.extend({
                    itemSelector: '.item'
                }, JSON.parse(attrs.masonry));

                scope.obj = new Masonry(container, options);




            }
        };
    })
    .directive('masonryTile', function () {
        return {
            restrict: 'AC',
            link: function (scope, elem) {
                var master = elem.parent('*[masonry]:first').scope();
                var masonry = master.obj;

                elem.ready(function () {
                    masonry.addItems([elem]);
                    masonry.reloadItems();
                    masonry.layout();
                });
            }
        };
    })
    .directive('masonryTestTile', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="tile one-by-one"><div>{{ item.title }}</div></div>',
            link: function (scope, elem) {
                var master = elem.parent('*[masonry]:first').scope();
                var masonry = master.obj;

                elem.ready(function () {
                    masonry.addItems([elem]);
                    masonry.reloadItems();
                    masonry.layout();
                });
            }
        };
    })

;
//})();