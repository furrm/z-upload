//(function(){

    "use strict";
    angular.module('isotope', [])
        .directive('isotope', function ($parse) {
            return {
                restrict: 'A',
                controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

                    var vm = this;

                    var container = $element[0];

                    // Extends objects
                    var options = angular.extend({
                        itemSelector: '.item'
                    }, JSON.parse($attrs.isotope));

                    $scope.isotope = new Isotope(container, options);

                    // Requires Lo-Dash http://lodash.com
                    // Documentation on _debounce can be found at http://lodash.com/docs#debounce
                    vm.reload = _.debounce(function(tile){
                        console.log('Write to log called by', tile);
                        $scope.isotope.reloadItems();
                        $scope.isotope.layout();
                    }, 100);

                }]
            };
        })
        .directive('isotopeTile', function () {
            return {
                restrict: 'E',
                require: '^isotope',
                templateUrl:'components/isotope/isotope-tile.html',
//                template:"<div>I an the Isotope template</div>",
                link: function (scope, elem, attrs, ctrl) {
                    console.log("isotopeTile"); // todo: delete me
                    scope.$on('$destroy', ctrl.reload('isotopeTile'));
                }
            };
        })
    ;
//})();