//(function() {
"use strict";

angular.module('masonry', ['ng'])
    .directive('masonry', function ($parse) {
        return {
            restrict: 'AC',
            controller:['$scope', function($scope){
                console.log('masonry controller');

                console.log('masonry controller $scope', $scope);

                $scope.message = 'Hello from the scope!!';
                this.sayHello = function(){console.log($scope.message)};
                $scope.$on('$destroy', console.log('masonry ctrl DESTROYED!!!', $scope));
            }],
            link: function (scope, elem, attrs) {
                console.log('masonry link');
                var container = elem[0];
                var options = angular.extend({
                    itemSelector: '.item'
                }, JSON.parse(attrs.masonry));

                scope.obj = new Masonry(container, options);

                console.log('masonry link scope', scope);


//                scope.$on('$destroy', console.log('masonry DESTROYED!!', scope));

            }
        };
    })
    .directive('masonryTile', function () {
        return {
            restrict: 'AC',
            require: '^masonry',
            link: function (scope, elem) {
                var master = elem.parent('*[masonry]:first').scope();
                var masonry = master.obj;

                elem.ready(function () {
                    //masonry.addItems([elem]);
                    masonry.reloadItems();
                    masonry.layout();
                });
            }
        };
    })
    .directive('masonryTestTile', function () {
        return {
            restrict: 'E',
            require: '^masonry',
            replace:true,
            template:'<div class="tile one-by-one"><div>{{ item.title }}</div></div>',
            link: function (scope, elem, attrs, ctrl) {
                var master = elem.parent('*[masonry]:first').scope();
                var masonry = master.obj;

                elem.ready(function () {
                    //masonry.addItems([elem]);
                    masonry.reloadItems();
                    masonry.layout();
                });

                console.log('masonryTestTile link scope', ctrl);

                scope.$on('$destroy', console.log('masonryTestTile DESTROYED!!', scope));

                ctrl.sayHello();

                console.log('ctrl.obj', ctrl);
            }
        };
    })

;
//})();