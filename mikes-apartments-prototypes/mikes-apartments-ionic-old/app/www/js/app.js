// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ionicApp', ['ionic'])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
//            .state('home', {
//                url: '/',
//                templateUrl: 'home.html'
////                ,
////                controller: 'IntroCtrl'
//            })
            .state('intro', {
                url: '/',
                templateUrl: 'intro.html'
//                ,
//                controller: 'MainCtrl'
            })
//            .state('side', {
//                url: '/side',
//                templateUrl: 'side.html',
//                abstract:true
////                ,
////                controller: 'MainCtrl'
//            })
//            .state('side.home', {
//                url: "/home",
//                views: {
//                    'menuContent' :{
//                        templateUrl: "home.html"
//                    }
//                }
//            })
//            .state('eventmenu', {
//                url: "/event",
//                abstract: true,
//                templateUrl: "event-menu.html"
//            })
            .state('eventmenu.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "templates/views/home.html"
                    }
                }
            })

        ;

        $urlRouterProvider.otherwise("/event/home");


    })

//.run(function($ionicPlatform) {
//  $ionicPlatform.ready(function() {
//    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//    // for form inputs)
//    if(window.cordova && window.cordova.plugins.Keyboard) {
//      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//    }
//    if(window.StatusBar) {
//      StatusBar.styleDefault();
//    }
//  });
//})
    .controller('MainCtrl', function ($scope, $ionicSideMenuDelegate) {

        $scope.test = function(){
          console.log("TEST CLICKED!!"); // todo: delete me
        };

        // Called each time the slide changes
        $scope.slideChanged = function (index) {
            console.log("Slide Index:", index); // todo: delete me
            $scope.slideIndex = index;
        };

        // Move to the next slide
        $scope.next = function() {
            $scope.$broadcast('slideBox.nextSlide');
        };

        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.toggleRight = function () {
            $ionicSideMenuDelegate.toggleRight();
        };
    })
    .controller('testCtrl', ['$scope', function ($scope) {
        $scope.name = 'testCtrl';
    }])

;


