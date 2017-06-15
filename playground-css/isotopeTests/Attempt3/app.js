"use strict";
angular.module('attempt3', [
    'ngRoute'])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/main', {
            templateUrl: 'views/main.html'
//            template:'<div>In the main!!</div>'
        })
        .otherwise({redirectTo: '/main'});

//        $locationProvider.html5Mode(true);
}])
.controller('AppCtrl', ['$scope', function($scope){
        $scope.name = 'AppCtrl';

        $scope.xList = [
            {name:'a', number:'1', date:'1360413309421', class:'purple'}
            ,{name:'b', number:'5', date:'1360213309421', class:'orange'}
            ,{name:'c', number:'10', date:'1360113309421', class:'blue'}
            ,{name:'d', number:'2', date:'1360113309421', class:'green'}
            ,{name:'e', number:'6', date:'1350613309421', class:'green'}
            ,{name:'f', number:'21', date:'1350613309421', class:'orange'}
            ,{name:'g', number:'3', date:'1340613309421', class:'blue'}
            ,{name:'h', number:'7', date:'1330613309001', class:'purple'}
            ,{name:'i', number:'22', date:'1360412309421', class:'blue'}
        ]


    }])
.directive('item', function(){
        return{
            restrict:'E',
            templateUrl:'tile.html',
            link:function(elem){
//                elem.$apply();
            }
        }
    })
;