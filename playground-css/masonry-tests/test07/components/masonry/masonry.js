"use strict";

angular.module('masonry', ['ng'])
    .directive('masonry', function ($parse) {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

                console.log("MASONRY"); // todo: delete me
                var container = $element[0];

                // Extends objects
                var options = angular.extend({
                    itemSelector: '.item'
                }, JSON.parse($attrs.masonry));

                $scope.masonry = new Masonry(container, options);

                // Requires Lo-Dash http://lodash.com
                // Documentation on _debounce can be found at http://lodash.com/docs#debounce
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
            restrict: 'E',
            require: '^masonry',
            templateUrl:'components/masonry/masonry-tile.html',
            link: function (scope, elem, attrs, ctrl) {
                console.log('MASONRY-TILE'); // todo: delete me

                console.log("MASONRY TILE DIRECTIVE:", scope); // todo: delete me

                // converts tile number to a string
                function tileSizeToClassBuilder() {

                    var splitVal = scope.item.size.split(',');

                    var sizeClass = numberToStringConverter(splitVal[0]) + "-by-" + numberToStringConverter(splitVal[1]);

                    return sizeClass;

                    function numberToStringConverter(number) {
                        switch (number) {
                            case '1':
                                return "one";
                                break;
                            case '2':
                                return "two";
                                break;
                            case '3':
                                return "three";
                                break;
                            case '4':
                                return "four";
                                break;
                            case '5':
                                return "five";
                                break;
                            default:
                                return "Not Supported";
                        }
                    }

                }

                scope.$on('$destroy', ctrl.reload('masonryTile'));
            }
        };
    })
;
