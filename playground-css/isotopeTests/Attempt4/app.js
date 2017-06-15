"use strict";
angular.module('attempt3', [
        'ngRoute'])
    .value('iso', Isotope)

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $timeout) {
        $routeProvider
            .when('/main', {
                templateUrl: 'views/main.html'
//            template:'<div>In the main!!</div>'
            })
            .otherwise({redirectTo: '/main'});

//        $locationProvider.html5Mode(true);
    }])
    .controller('AppCtrl', ['$scope', 'iso', function ($scope, $timeout) {
        $scope.name = 'AppCtrl';


//        console.log('iso', iso);
//        console.log('Isotope', Isotope);
//
//        var isoTest = new iso();
//        var isotopeTest = new Isotope();
//
//        console.log('isoTest', isoTest);
//        console.log('isotopeTest', isotopeTest);
        $scope.items = [];

//        $timeout(function(){
        $scope.items = [
            {id: 1, title: 'tile1', size: "1,1"},
            {id: 2, title: 'tile2', size: "2,2"},
            {id: 3, title: 'tile3', size: "3,3"}
        ];
//        });
        console.log('AppCtrl - $scope', $scope);



    }])
    .directive('isotope2', function (iso, $timeout) {
        return{
            restrict: 'A',
            scope: {
                items: '@items'
            },
//                template:'<div class="item" ng-repeat="item in items track by $index">{{ item.id }}</div>',
//            template: '<div>test item</div>',
            link: function ($scope, $element, $attributes, $ctrl) {
                console.log('isotope2 directive - $scope', $scope);
                console.log('isotope2 directive - $element', $element);
                console.log('isotope2 directive - $attributes', $attributes);
                console.log('isotope2 directive - $ctrl', $ctrl);
                console.log('isotope2 directive - iso', iso);
                console.log('isotope2 directive - this', this);

                var container = document.querySelector('#isocontainer');
                console.log('isotope2 directive - container', container);

                var isoto = new Isotope(container, {
                    // options
                    itemSelector: '.item',
                    layoutMode: 'fitRows'
                });

                console.log('isotope2 directive - $element', $element);
                console.log('isotope2 directive - container', container);

                console.log('isotope2 directive - isoto', isoto);

                $scope.$watch('items', function (newVal, oldVal) {
                    console.log('isotope2 directive - $watch called', $scope.items);

                    $timeout(function () {
                        isoto.reloadItems();
                    });
                }, true);
            }
        }
    })
    .directive('item', function () {
        return{
            restrict: 'E',
            template: '<div class="item">item</div>',
            link: function (elem) {
//                elem.$apply();
            }
        }
    })
;