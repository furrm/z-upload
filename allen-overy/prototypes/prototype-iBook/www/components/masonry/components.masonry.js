(function () {

    "use strict";
    angular.module('masonry', [])

        .directive('masonry', function () {
            return {
                restrict: 'A',
                controller: ['$element', '$attrs', function ($element, $attrs) {

                    var vm = this;

                    var container = $element[0];


                    // Extends objects
                    var options = angular.extend({
//                        itemSelector: '.item'
                    }, JSON.parse($attrs.masonry));

                    vm.masonry = new Masonry(container, options);

                    // test to make the tiles size dynamically and fill the container.

                    // specify the amount of columns to display.
                    var columnsToDisplay = 12;

                    // work out the column size
                    vm.columnWidth = vm.masonry.containerWidth / columnsToDisplay;
                    vm.masonry.containerWidth = vm.masonry.containerWidth *2

                    // specify that each tile will be the same size
//                    vm.tileWidth = columnWidth;

                    //override the masonry column width
                    vm.masonry.options.columnWidth = vm.columnWidth;


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

                    console.log('attrs',attrs.tile); // todo: delete me

                    var tile = JSON.parse(attrs.tile);

                    var tileSizeClass = tileSizeToClassBuilder(tile.size);
//                    var tileSizeClass = tileSizeToClassBuilder(scope.item.size);

                    // Define the size of the tile
                    elem.addClass(tileSizeClass);

                    // Load the correct content template for the tile
                    scope.tileTemplate = tile.template;
//                    scope.tileTemplate = scope.item.template;

                    // test to make the tiles size dynamically and fill the container.

                    // override class definitions by adding the tile size as a style.
                    // the the width of a tile is based on the column width.
                    scope.tileSize = tileSizeToStyleBuilder(ctrl.columnWidth, tile.size);
//                    scope.tileSize = tileSizeToStyleBuilder(ctrl.columnWidth, scope.item.size);

                    // tile background image
                    scope.imageUrl = tile.imageUrl;
//                    scope.imageUrl = scope.item.imageUrl;

                    // tile caption
                    scope.caption = tile.caption;
//                    scope.caption = scope.item.caption;


                    function tileSizeToStyleBuilder(columnWidth, tileSize){

                        var splitVal = tileSize.split(',');

                        var tileWidth = columnWidth * parseInt(splitVal[0]);
                        var tileHeight = columnWidth * parseInt(splitVal[1]);

                        var cssTileWidth = tileWidth  + "px";
                        var cssTileHeight = tileHeight  + "px";



                        return{
                            "height" : cssTileWidth,
                            "width" : cssTileHeight
                        };
//                        return "height:" + tileSize + ";width:" + tileSize + ";";
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
        .directive('markup', function(){
            return{
                restrict:'E',
                replace:true,
                transclude:true,
                scope:{
                    markdown: "@"
                },
                link: function(scope, element, attrs) {

//                var htmlText = "<p>poo</p>";
//                var htmlText = element.html();
                    var htmlText = scope.markdown;
                    element.html(marked(htmlText));
                }
            }
        })
    ;

})();