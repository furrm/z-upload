"use strict";

angular.module('app', [
        // Angular
        'ngRoute',
        // Custom Services
        'adapter-services',
        // Custom Controllers
        'room-controllers'
    ])
    .value('RoomName', undefined)
    .factory('socketService', function(){
        var socketio = undefined;
        return{
            connect: function(socketAddress){
                return io.connect(socketAddress);
            },
            session:undefined
        }
    })
    .config(function($routeProvider, $locationProvider){
        $routeProvider
            .when('/main', {
                templateUrl: 'content/main.html'
            })
            .when('/:room', {
                templateUrl: 'content/room.html',
                controller: 'roomCtrl'
            })
            .otherwise({redirectTo:'/main'});
//        $locationProvider.html5Mode(!0)
    })
    .controller('AppCtrl', function ($scope, $location, socketService) {
        $scope.name = 'AppCtrl';

        var socketAddress = "http://localhost:1337/";

        var socketio = socketService.connect(socketAddress);

//        var socketio = io.connect(socketAddress);



        $scope.createRoom = function (roomName) {

            socketio.emit('createRoom', roomName);
            $location.url('/' + roomName);

        };

//      Socket.IO Listeners
        socketio.on('connected', function (data) {

            $scope.$apply(function ()
            {
                console.log(data);
                console.log(socketio.socket.sessionid);
                $scope.message = data;
            });

        });

        // PING BACK
        // USED TO ENSURE CONNECTIVITY TO THE SOCKET, OTHERWISE HOW DO YOU KNOW YOU ARE CONNECTED??
        // TODO: Is there an alternative approach?
//        socketio.on('pingBack', function (data) {
//            console.log(data);
//
//            $scope.$apply(function () {
//                $scope.message = data;
//            });
//        });

        // ROOM CREATED
        socketio.on('roomMessage', function (data) {
            console.log(data);
        });

        socketio.on('sendBack', function (data) {
            console.log(data);
        });



    })
;