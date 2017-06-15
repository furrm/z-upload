angular.module('app', ['app.finance.controllers', 'app.components', 'app.finance.components.panels', 'app.finance.components.charts', 'app.services'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: 'templates/content/main.html'
            })
            .when('/signin', {
                templateUrl: 'templates/content/sign-in.html'
            })
            .when('/css', {
                templateUrl: 'templates/content/css.html'
            })
            .when('/chart', {
                templateUrl: 'templates/content/chart.html'
            })
            .when('/matter-info', {
                templateUrl: 'templates/content/matter-info.html'
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
    .controller('AppCtrl', function ($scope, $timeout, matterLifeToDateService, workInProgressService, unpaidInvoiceService, authService) {

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

        // Authentication Logic
        // Actions:
        // 1 - sign in
        // 0 - sign out
        $scope.authentication= authService;

        $scope.toggleAuthentication = function(arg, username, password){
//                     alert(arg);
            if(arg === 0)
            {
                $scope.authentication.userLoggedIn = true;
                $scope.authentication.userName =  username;
                $scope.authentication.password =  password;

                if(sideMenuIsOpen){this.toggleSideMenuState()} ;

            }

            if(arg == 1){
                $scope.authentication.userLoggedIn = false;
                $scope.authentication.userName =  username;
                $scope.authentication.password =  password;
            }


        }

        $scope.matterNotSelected = 1;


//        $scope.downloadingData = false;
        $scope.haveMatterInfo = false;
        $scope.haveMatterOverviewLifeToDate = false;
        $scope.haveWorkInProgress = false;
        $scope.haveUnpaidInvoices = false;



        $scope.matterSelected = 0; // Used to manipulate the page header (panel-page-header)...

        // DATA STATUS
        // 1 - Matter not selected...
        // 2 - Matter selected and getting data...
        // 3 - Success...
        // 4 - Failure...

        $scope.matterInfoStatus = 1;
        $scope.matterOverviewLifeToDateStatus = 1;
        $scope.workInProgressStatus = 1;
        $scope.unpaidInvoicesStatus = 1;

        // BUTTON STATES
        $scope.matterInfoIsDisabled = true;
        $scope.matterOverviewLifeToDateIsDisabled = true;
        $scope.workInProgressIsDisabled = true;
        $scope.unpaidInvoicesIsDisabled = true;

        $scope.switchMatter = function (matterNumber, matterName) {
//
            // When switching over to a new matter, close the sliding menu...
            // Ok, the behaviour is different to the iOS app, but this could prevent a DoS attack on the services =)
//            $scope.sideMenuCss = sideMenuCloseCssClass;
//            $scope.mainCss = mainCloseCssClass;
//            $scope.maskCss = maskInactiveCssClass;
            this.toggleSideMenuState();

            $scope.selectedMatter = matterNumber;
            $scope.selectedMatterName = matterName;

            $scope.matterSelected = 1;

            $scope.matterNotSelected = !$scope.matterNotSelected

            $scope.downloadingData = true;



            $scope.haveMatterOverviewLifeToDate = 0;

            $scope.matterInfoStatus = 2;
            $scope.matterOverviewLifeToDateStatus = 2;
            $scope.workInProgressStatus = 2;
            $scope.unpaidInvoicesStatus = 2;

            // Make the calls to the service...
            //TODO: MatterInfo
            $scope.matterLifeToDate = matterLifeToDateService.matterLifeToDate;
            $scope.workInProgress = workInProgressService.workInProgress;
            $scope.unpaidInvoices = unpaidInvoiceService.unpaidInvoices;


            console.log('Getting Data...');
            $timeout(function(){

                $scope.matterInfoStatus = 3



            }, 1000);

            $timeout(function(){

                $scope.downloadingData = false;
                $scope.haveMatterOverviewLifeToDate = 1;
                $scope.matterOverviewLifeToDateStatus = 3



            }, 5000);

            $timeout(function(){

                $scope.workInProgressStatus = 3

            }, 4000);

            $timeout(function(){

                $scope.unpaidInvoicesStatus = 3

            }, 3000);

        }


          $scope.loginData = true;

    })
;