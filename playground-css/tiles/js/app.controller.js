(function () {

    "use strict";

    angular.module('app-controller', [])
        .controller('Application', Application)
    ;

    Application.$inject = ['$timeout'];

    function Application($timeout) {
        var vm = this;
        vm.name = 'ApplicationController';


        var tiles = [
            {id: 1, title: 'ONE', size: '2,2', template:'image'},
            {id: 2, title: 'TWO', size: '2,2', template:'image'},
            {id: 3, title: 'THREE', size: '4,4', template:'video'},
            {id: 4, title: 'FOUR', size: '2,2', template:'video'},
            {id: 5, title: 'FIVE', size: '2,2', template:'image'},
            {id: 5, title: 'SIX', size: '4,2', template:'image'}
        ];

        vm.items = [];


//        Emulate a service call
        $timeout(function () {

            vm.items = tiles;

        }, 1000);


    }

})();