// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'starter.controllers',
    'services',
    'fullscreen.radial'
])

    //.config(function($ionicConfigProvider) {


        // note that you can also chain configs
        //$ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
    //})

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/app.html",
                controller: 'AppCtrl'
            })

            .state('app.matterProgressTracker', {
//                url: "/matter-info",
                url: "/matter-progress-tracker/:clientId/:matterId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/matter-progress-tracker.html",
                        controller: function($scope, $stateParams, MatterFinance){



                            $scope.title = "Progress Tracker";
                            $scope.routeParams = $stateParams;

                            MatterFinance.selectedMatter.clientId = $stateParams.clientId;
                            MatterFinance.selectedMatter.matterId = $stateParams.matterId;

                            $scope.matterFinance = MatterFinance;

                            console.log("$stateProvider", $stateProvider); // todo: delete me
                            console.log("MatterFinance", MatterFinance); // todo: delete me


                        }
                    }
                }
            })

            .state('app.matterFinance', {
//                url: "/matter-info",
                url: "/matter-finance/:clientId/:matterId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/matter-finance.html",
                        controller: function($scope, $stateParams, MatterFinance){
                            $scope.title = "Matter Finance";

                            //MatterFinance.selectedMatter.clientId = $stateParams.clientId;
                            //MatterFinance.selectedMatter.matterId = $stateParams.matterId;

                            $scope.stateParams = $stateParams;
                            $scope.matterFinance = MatterFinance;

                            console.log("$stateProvider", $stateProvider); // todo: delete me
                            console.log("MatterFinance", MatterFinance); // todo: delete me


                        }
                    }
                }
            })

            .state('app.matterInfo', {
//                url: "/matter-info",
                url: "/matter-info/:clientId/:matterId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/matter-info.html",
                        controller: function($scope, $stateParams){
                            $scope.title = "Matter Information";
                            $scope.routeParams = $stateParams;

                            console.log("$stateProvider", $stateProvider); // todo: delete me

                        }
                    }
                }
            })





            .state('app.matterTeam', {
                url: "/matter-team",
                views: {
                    'menuContent': {
                        templateUrl: "templates/matter-team.html",
                        resolve: {
                            pageData: function () {
                                return {
                                    "title": "Matter Team"
                                };
                            },
                            teamData:function(){
                                return{

                                }
                            }
                        },
                        controller:"MembersCtrl"

//                        controller: function($scope, $rootScope, pageData, teamData){
//                            $scope.pageData = pageData;
//                            $scope.teamData = teamData;
//
//                            $scope.selectMember = function(member){
//
//                                console.log("member selected", member); // todo: delete me
//
//                                $scope.register = function(){
//                                    $rootScope.$broadcast("memberSelected", member)
//                                }
//
////                                $rootScope.$emit("memberSelected", member);
////                                $rootScope.$broadcast("memberSelected", member);
//
//                            }
//                        }
                    }
                }
            })

            .state('app.matterTeamMember', {
                url: "/matter-team/member",
                views: {
                    'menuContent': {
                        templateUrl: "templates/matter-team-member.html",
                        controller: "MemberCtrl"
                    }
                }
            })

            .state('app.matterSecurity', {
                url: "/matter-security",
                views: {
                    'menuContent': {
                        templateUrl: "templates/matter-security.html",
                        controller: function($scope){
                            $scope.title = "Matter Security";
                        }
                    }
                }
            })

            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html"
                    }
                }
            })

            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "templates/browse.html"
                    }
                }
            })


            .state('app.single', {
                url: "/playlists/:playlistId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlist.html",
                        controller: 'PlaylistCtrl'
                    }
                }
            })
        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/matter-progress-tracker');
    });
