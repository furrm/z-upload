angular.module('app.components', [])

    .directive('mhaHeader', function () {
        return{
            scope: {
                photo: '@',
                showburger: '@'
            },
            restrict: 'E',
            replace: 'true', // important: otherwise menu toggle won't work!!
            templateUrl: 'templates/mha-header.html',
            link: function (scope, element) {

                console.log('element', element);


                var headerHeight = element[0].clientWidth - (element[0].clientWidth * 0.20) + "px";

                scope.height = headerHeight;

                element.css("height",headerHeight);
                element.css("background-image", "url(" + scope.photo + ")");


            },

            controller: ['$scope', '$ionicHistory', function ($scope, $ionicHistory) {




//                console.log($scope.photo); // todo: delete me

                $scope.showBurger = (canGoBack() === false);

                $scope.showBack = canGoBack();


                // used by the back arrow
                $scope.back = function () {
                    $ionicHistory.goBack();


                };

                function canGoBack() {

                    if ($ionicHistory.backView()) {

                        var currentView = $ionicHistory.currentView();

                        if (currentView.stateId === "app.home") {
                            return false
                        }

                        return true;
                    }
                    else {
                        return false;
                    }

                }

//                function booleanCheck(string) {
//                    if (string) {
//                        switch (string.toLowerCase()) {
//                            case "true":
//                            case "yes":
//                            case "1":
//                                return true;
//                            case "false":
//                            case "no":
//                            case "0":
//                            case null:
//                                return false;
//                            default:
//                                return false;
////                                default: return Boolean(string);
//                        }
//                    }
//                    else {
//                        return false
//                    }
//                }
            }]
        }
    })

    .directive('mhaSubHeader', function () {
        return{
            "scope":{
              "text":"@"
            },
            restrict: 'E',
            templateUrl: 'templates/mha-sub-header.html'

        }
    })

    .directive('background', ['preload', function (preload) {
        return {
            restrict: 'E',
            templateUrl:'templates/mha-header-test.html',
            replace:true,
            link: function (scope, element, attrs) {

//                element[0].hide();

                preload(attrs.url).then(function () {
                    element.css({
                        "background-image": "url('" + attrs.url + "')"
                    });
//                    element.fadeIn();
                });
            }
        };
    }])
;