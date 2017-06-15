'use strict';

// Declare app level module which depends on filters, and services
//angular.module('app', ['myApp.filters', 'myApp.services', 'myApp.directives', 'app.controllers']).

angular.module('app', ['app.services', 'app.controllers', 'app.directives'])
    .config(['$routeProvider', function($routeProvider) {

        //var templateDirectory = 'templates/';
        //var pagesDirectory = templateDirectory + 'pages/';

        //// Components...
        //$routeProvider.when('/panel', { templateUrl: pagesDirectory + 'page-panel.html' });


        //$routeProvider.when('/signin', { templateUrl: templateDirectory + 'templateSignin.html' });
        //$routeProvider.when('/view1', { templateUrl: 'scripts/app/templates/templateSingle.html' });
        //$routeProvider.when('/view2', { templateUrl: 'scripts/app/templates/templateDouble.html', controller: 'View2Ctrl' });
        ////$routeProvider.otherwise({ redirectTo: '/view0' });
    }]).run([function() {
        alert('application running');
    }]);










