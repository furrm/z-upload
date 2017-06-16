(function () {

    "use strict";
    angular.module('masonry', [])

        //todo: split

        .directive('masonry', function () {
            return {
                restrict: 'A',
                controller: ['$element', '$attrs', function ($element, $attrs) {

                    var vm = this;

                    // get the masonry container
                    var container = $element[0];


                    // Add the json from this masonry directive.
                    // Note that the columnWidth property is ignored as it is set dynamically by this directive.
                    // Extends objects
                    var options = angular.extend({
//                        itemSelector: '.item'
                    }, JSON.parse($attrs.masonry));

                    vm.masonry = new Masonry(container, options);


                    // specify the amount of columns to display.
                    var isPhone = window.matchMedia('(max-width: 767px)').matches;

                    // by default, there are 6 columns.
                    var columnsToDisplay = 6;


                    if(isPhone){
                        var columnsToDisplay = 4;
                    }



                    // work out the columnWidth size
                    vm.columnWidth = vm.masonry.containerWidth / columnsToDisplay;
//                    vm.masonry.containerWidth = vm.masonry.containerWidth *2

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
                replace: true,
                link: function (scope, elem, attrs, masonryCtrl) {

                    //var isPhone = window.matchMedia('(max-width: 767px)').matches;

                    //console.log(isPhone); // todo: delete me

                    var tileTypeClass = tileTypeToClassBuilder(scope.item.size)

                    // Define the size of the tile
                    elem.addClass(tileTypeClass);
                    //elem.addClass('z-depth-1');

                    // Load the correct content template for the tile
                    scope.tileTemplate = scope.item.template;

                    // test to make the tiles size dynamically and fill the container.

                    // override class definitions by adding the tile size as a style.
                    // the the width of a tile is based on the column width.
                    scope.tileStyle = tileSizeToStyleBuilder(masonryCtrl.columnWidth, scope.item.size, 4);

                    // tile background image
                    scope.imageUrl = scope.item.imageUrl;

                    // tile caption
                    scope.caption = scope.item.caption;

                    // link object
                    // not that the way links are handled are custom per app
                    scope.link = scope.item.link;

                    // the following function is used to define the style of the tile element
                    // above and beyond that of the css class
                    function tileSizeToStyleBuilder(columnWidth, tileSize, margin) {

                        var cssMargin = margin + "px";

                        var cssTileWidth, cssTileHeight, totalMarginWidth, totalMarginHeight;

                        //if (isPhone) {
                        ////if (false) {
                        //
                        //    //if it's a phone, we want the tile to be full width of the container
                        //    totalMarginWidth = margin * 2; // Left and right margin
                        //    totalMarginHeight = margin * 2; // top and bottom margin
                        //
                        //
                        //    cssTileWidth = masonryCtrl.masonry.containerWidth - totalMarginWidth + "px";
                        //    cssTileHeight = masonryCtrl.masonry.containerWidth - totalMarginHeight + "px";
                        //
                        //    return {
                        //        "height": cssTileHeight,
                        //        "width": cssTileWidth,
                        //        "margin": cssMargin
                        //    };
                        //
                        //}
                        //else {
                            var splitVal = tileSize.split(',');

                            var tileWidth = (columnWidth * parseInt(splitVal[0]));
                            var tileHeight = (columnWidth * parseInt(splitVal[1]));

                            totalMarginWidth = margin * 2; // Left and right margin
                            totalMarginHeight = margin * 2; // Left and right margin

                            cssTileWidth = tileWidth - totalMarginWidth + "px";
                            cssTileHeight = tileHeight - totalMarginHeight + "px";

                            //return{
                            //    "height" : cssTileWidth,
                            //    "width" : cssTileHeight
                            //};

                            return {
                                "height": cssTileWidth,
                                "width": cssTileHeight,
                                "margin": cssMargin
                            };

                        //}


//                        return "height:" + tileStyle + ";width:" + tileStyle + ";";
                    }


                    function tileTypeToClassBuilder(tileSize) {

                        var splitVal = tileSize.split(',');

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
                    scope.$on('$destroy', masonryCtrl.reload('masonryTile'));
                }
            };
        })
        .directive('markup', function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    markdown: "@"
                },
                link: function (scope, element, attrs) {

//                var htmlText = "<p>poo</p>";
//                var htmlText = element.html();
                    var htmlText = scope.markdown;
                    element.html(marked(htmlText));
                }
            }
        })
        .directive('ratio', function ($timeout) {
            return {
                restrict: 'A',
                //controller: ['$element', '$attrs', function ($element, $attrs) {
                //    var width = angular.element($element);
                //    console.log("ratio width", width); // todo: delete me
                //}]
                link: function (scope, element, attrs) {

                    console.log('attrs', attrs.ratio); // todo: delete me
                    console.log('attrs', attrs.position); // todo: delete me

                    var ratio = attrs.ratio;
                    var position = attrs.position;

                    var splitVal = ratio.split(':');

                    console.log('splitVal', splitVal); // todo: delete me

                    var A = parseInt(splitVal[0]);
                    var B = parseInt(splitVal[1]);


                    angular.element(document).ready(function () {
                        //MANIPULATE THE DOM

                        // get the current element width
                        var currentElementWidth = element.parent()[0].clientWidth;
                        var currentElementHeight = element.parent()[0].clientHeight;

                        // divide the width of the current element width by ratio A.
                        var ratioPixels = currentElementWidth / A;


                        var newHeight = (ratioPixels * B);

                        var cssHeight;

                        if(position==='top'){
                            cssHeight = newHeight + 'px';
                        }
                        if(position==='bottom'){
                            cssHeight = (currentElementHeight - newHeight) + 'px';
                        }

                        console.log('currentElementWidth', currentElementWidth); // todo: delete me
                        console.log('currentElementHeight', currentElementHeight); // todo: delete me
                        console.log('newHeight', newHeight); // todo: delete me

                        element.css({height: cssHeight});
                    });

                }
            };
        })

    //    .directive('ratioA', function () {
    //        return {
    //            restrict: 'E',
    //            template:'<div style="background-color: red;">{{message}}</div>',
    //            replace: true,
    //            //transclude: true,
    //            link: function(scope, element, attrs) {
    //                scope.message = "ratio-a directive"
    //            }
    //        }
    //    }
    //)

})();