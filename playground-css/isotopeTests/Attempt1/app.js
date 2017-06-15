"use strict";

angular.module('app',[])
    .controller('AppCtrl', function ($scope) {
    $scope.name = 'appCtrl';



        $scope.addTile = function (cssSize) {
            $scope.items.push({title:'new', order:2, size:'1,1'});
        }
})
    .controller('IsoCtrl', function ($scope, $element) {
        $scope.name = 'IsoCtrl';
//
//        var iso = new Isotope( $element.id, {
//            // options
//            itemSelector: '.item',
//            layoutMode: 'fitRows'
//        });

//        console.log($element);

//        var isoItems = [
//            {title:'tile01', order:1, size:'1,1'},
//            {title:'tile02', order:2, size:'1,1'},
//            {title:'tile03', order:2, size:'1,1'},
//            {title:'tile04', order:2, size:'1,1'},
//            {title:'tile05', order:2, size:'1,1'},
//            {title:'tile06', order:2, size:'1,1'},
//            {title:'tile07', order:2, size:'1,1'},
//            {title:'tile08', order:2, size:'1,1'},
//            {title:'tile09', order:2, size:'1,1'},
//            {title:'tile10', order:2, size:'1,1'}
//        ];
//
//
//        iso.addItems("<div class='element'>Tile</div>");

//                $scope.items =
//        console.log('iso',iso);
    })    .directive('isotopeWall', function(){
        return{
            restrict:'A',
            scope:{
                id: '@id'
            },
            controller:function($scope, $element){

                console.log($scope);

                console.log($element);

//                $timeout(function () {
//                    var iso = new Isotope('#' + $scope.id + '', {
//                        // options
//                        itemSelector: '.item',
//                        layoutMode: 'fitRows'
//                    });
//
//
//                    }, 0);


//                console.log(iso);
//
//                $scope.$eval(iso);


            },
            link:function($scope){

            }
        }
    })
;
