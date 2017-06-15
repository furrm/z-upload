(function () {

    "use strict";
    angular.module('masonry', [])

        .directive('masonry', function () {
            return {
                restrict: 'A',
                controller: ['$element', '$attrs', function ($element, $attrs) {

                    var vm = this;

                    var container = $element[0];

                    console.log("Container", $element); // todo: delete me

                    // Extends objects
                    var options = angular.extend({
//                        itemSelector: '.item'
                    }, JSON.parse($attrs.masonry));

                    vm.masonry = new Masonry(container, options);

                    var columnsToDisplay = 4;
                    var columnSize = vm.masonry.containerWidth / columnsToDisplay;

                    vm.tileWidth = columnSize;

                    //override the column width
//                    vm.masonry.cols = columnsToDisplay;
                    vm.masonry.options.columnWidth = columnSize;

                    console.log("columnSize",columnSize); // todo: delete me
                    console.log("vm.masonry",vm.masonry); // todo: delete me




                    // Requires Lo-Dash http://lodash.com
                    // Documentation on _debounce can be found at http://lodash.com/docs#debounce
                    vm.reload = _.debounce(function (tile) {
                        console.log('Write to log called by', tile);
                        vm.masonry.reloadItems();
                        vm.masonry.layout();
                    }, 100);



                }]
            };
        })
        .directive('masonryTile', function () {
            return {
                restrict: 'E',
                require: '^masonry',
                templateUrl: 'components/masonry/masonry-tile.html',
//                template:"<div>I an the masonry template</div>",
                replace:true,
                link: function (scope, elem, attrs, ctrl) {



                    var tileSizeClass = tileSizeToClassBuilder(scope.item.size)

                    // Define the size of the tile
                    elem.addClass(tileSizeClass);

                    // Load the correct content template for the tile

                    scope.tileTemplate = scope.item.template;


                    console.log("ctrl.tileWidth",ctrl.tileWidth); // todo: delete me

                    //
                    function tileSizeToStyleBuilder(tileSize, tileWidth){

                    }


                    function tileSizeToClassBuilder(tileSize) {

                        var splitVal = tileSize.split(',');
//                        var splitVal = scope.item.size.split(',');

                        return numberToStringConverter(splitVal[0]) + "-by-" + numberToStringConverter(splitVal[1]);


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

                    console.log('ATTRS ITEM', attrs)
                    scope.$on('$destroy', ctrl.reload('masonryTile'));
                }
            };
        })
    ;

})();