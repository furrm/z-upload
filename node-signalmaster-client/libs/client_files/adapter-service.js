"use strict";

angular.module('adapter-services', [])
.factory('socket', function($rootScope){
    var socketio;
    return{
        name:'socket.io wrapper',
        isConnected:false,
        socketMessage:"",
        connect:function(endpoint){
            socketio = io.connect(endpoint);

            socketio.on('pingBack', function(data){
                console.log(data);
                this.isConnected = true;
                this.socketMessage = data;
                $rootScope.$apply();
            })

//            console.log(socketio);
//            this.isConnected = true;
        },
        getClients:function(){

        },
        getRooms:function(){
            return socketio.sockets.manager.rooms;
        },
        createRoom:function(name){

        }

    }
})
;