angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {



        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };


    })


    .controller('MembersCtrl', ['$scope', 'Members', function ($scope, Members) {


        $scope.teamData = Members.data;
        ;

        $scope.member = Members.data;

        $scope.selectMember = function (member) {

            console.log("member selected", member); // todo: delete me
            Members.selectedMember = member;

        };


//        $scope.$on("memberSelected", function(event, args){
//            console.log("HEARD THE EVENT!!"); // todo: delete me
//            $scope.member = "It Worked";
//        });
    }])
    .controller('MemberCtrl', ['$scope', 'Members', function ($scope, Members) {
        $scope.name = 'MemberCtrl';

        $scope.member = Members.selectedMember;

        $scope.call = function () {
            console.log("Starting call with:", Members.selectedMember.tel); // todo: delete me
            window.location = "sip:" + Members.selectedMember.tel;
        };

        $scope.im = function () {
            console.log("Starting IM with:", Members.selectedMember.o365email); // todo: delete me
            window.location = "xmpp:" + Members.selectedMember.o365email;
        };


    }])

    .controller('MenuCtrl', ['$scope', 'MatterFinance', function ($scope, MatterFinance) {
        $scope.name = 'MenuCtrl';

        $scope.matterFinance = MatterFinance;
    }])

;
