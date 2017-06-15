angular.module('app', ['app.finance.controllers', 'app.components', 'app.finance.components.panels', 'app.services'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: 'templates/content/main.html'
            })
            .when('/css', {
                templateUrl: 'templates/content/css.html'
            })
            .when('/matter-overview-life-to-date', {
                templateUrl: 'templates/content/matter-overview-life-to-date.html'
            })
            .when('/work-in-progress', {
                templateUrl: 'templates/content/work-in-progress.html'
            })
            .when('/unpaid-invoices', {
                templateUrl: 'templates/content/unpaid-invoices.html'
            })
            .otherwise({redirectTo: '/main'});
    }])
    .controller('AppCtrl', function ($scope) {
        $scope.name = 'App Controller';

        // Menu specific classes
        var sideMenuOpenCssClass = 'slide-menu slide-menu-vertical slide-menu-left slide-menu-open';
        var sideMenuCloseCssClass = 'slide-menu slide-menu-vertical slide-menu-left';
        var topMenuOpenCssClass = 'slide-menu slide-menu-horizontal slide-menu-top slide-menu-open';
        var topMenuClosedCssClass = 'slide-menu slide-menu-horizontal slide-menu-top';

        // main specific classes
        var mainOpenCssClass = 'main-push main-push-toright';
//                var mainCloseCssClass = 'main-push main-push-toright' // force open for dev
        var mainCloseCssClass = 'main-push';

        // mask specific classes
        var maskActiveCssClass = "main-mask main-mask-menu-open";
        var maskInactiveCssClass = "main-mask";

        var sideMenuIsOpen = 0;


        $scope.sideMenuCss = sideMenuCloseCssClass;
        $scope.mainCss = mainCloseCssClass;
        $scope.maskCss = maskInactiveCssClass;

        $scope.toggleSideMenuState = function () {

            if (sideMenuIsOpen) // then close it...
            {
//                       alert('Close the menu...');
                $scope.sideMenuCss = sideMenuCloseCssClass;
                $scope.mainCss = mainCloseCssClass;
                $scope.maskCss = maskInactiveCssClass
            } else // then open it
            {
//                        alert('Open the menu...');
                $scope.sideMenuCss = sideMenuOpenCssClass;
                $scope.mainCss = mainOpenCssClass;
                $scope.maskCss = maskActiveCssClass

            }

            sideMenuIsOpen = !sideMenuIsOpen;

        }

        var topMenuIsOpen = 0;

        $scope.topMenuCss = topMenuClosedCssClass;

        $scope.toggleTopMenuState = function () {

            if (topMenuIsOpen) // then close it...
            {
//                       alert('Close the menu...');
                $scope.topMenuCss = topMenuClosedCssClass;
//                $scope.mainCss = mainCloseCssClass;
//                $scope.maskCss = maskInactiveCssClass
            } else // then open it
            {
//                        alert('Open the menu...');
                $scope.topMenuCss = topMenuOpenCssClass;
//                $scope.mainCss = mainOpenCssClass;
//                $scope.maskCss = maskActiveCssClass

            }

            topMenuIsOpen = !topMenuIsOpen;

        }

        var selectedMatterId = 'Nothing Selected!!';

        $scope.switchMatter = function (args) {
//                    alert(args);
            $scope.selectedMatter = args;
        }


    })
//    .controller('CacheCtrl', function ($scope) {
//
//    })
;