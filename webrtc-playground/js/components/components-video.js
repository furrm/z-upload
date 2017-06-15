"use strict";

angular.module('components-video', [])
    .directive('videoPlayer', function () {
        return{
            restrict: 'AE',
            templateUrl: 'components/video-player.html',
            replace: true

        }
    })
    .directive('enableMediaStream', function () {
        return{
            restrict: 'A',
            link: function (scope, attrs, elem, ctrl) {

//                console.log(elem.parent);

                navigator.getMedia = ( navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia);

                // TODO: What's the difference between getUserMedia() and getMedia()
                navigator.getMedia(

                    // constraints
                    {
                        video: true,
                        audio: true
                    },

                    // successCallback
                    function (localMediaStream) {
//
                        window.stream = localMediaStream; // stream available to console
                        var video = document.querySelector('video');
                        video.src = window.URL.createObjectURL(localMediaStream);
                        video.play();
                        console.log('Running refactored code...');
//                        elem.src = window.URL.createObjectURL(localMediaStream);
//                        elem.play();
                    },

                    // TODO: Better error handling required.
                    // errorCallback
                    function (err) {

                        // PERMISSION_DENIED: The user denied permission to use a media device required for the operation.
                        // NOT_SUPPORTED_ERROR: A constraint specified is not supported by the browser.
                        // MANDATORY_UNSATISFIED_ERROR: No media tracks of the type specified in the constraints are found.

                        console.log(err);

                    }

                );

            }
        }
    })
    .directive('localVideoPlayer', function () {
        return{
            restrict: 'E',
            templateUrl: 'components/local-video-player.html',
//                template:'<h1>Hello</h1>',
            controller: function ($scope, LocalVideoStateManager) {
                $scope.localVideoStateManager = LocalVideoStateManager;

                // START:OPERATIONS
                $scope.start = function () {
                    LocalVideoStateManager.video.status = 'start';
                    start();
                    LocalVideoStateManager.video.status = 'started';

                }

                $scope.call = function () {
                    LocalVideoStateManager.video.status = 'calling';
                    call();
                    LocalVideoStateManager.video.status = 'called';
                }

                $scope.hangUp = function () {
                    LocalVideoStateManager.video.status = 'hanging up';
                    hangup();
                    LocalVideoStateManager.video.status = 'connection closed';


                }
                // END:OPERATIONS
            },
            link: function (scope, elem, attrs, ctrl) {


            }
        }
    })
    .directive('remoteVideoPlayer', function () {
        return{
            restrict: 'E',
            template: '<video id="remoteVideo" autoplay></video>'
        }
    })
;
var localVideo;
var remoteVideo;
var localStream, localPeerConnection, remotePeerConnection;

function trace(text) {
//        console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

// CALLBACK FROM START()
function gotStream(stream) {
    trace("Received local stream");
    localVideo.src = URL.createObjectURL(stream);
    localStream = stream;
//        callButton.disabled = false;
}

function start() {
    trace("Requesting local stream");
//        startButton.disabled = true;

    localVideo = document.getElementById("localVideo");

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    navigator.getUserMedia({audio: true, video: true}, gotStream,
        function (error) {
            trace("navigator.getUserMedia error: ", error);
        });
}

function call() {
//        callButton.disabled = true;
//        hangupButton.disabled = false;
    trace("Starting call");

    if (localStream.getVideoTracks().length > 0) {
        trace('Using video device: ' + localStream.getVideoTracks()[0].label);
    }
    if (localStream.getAudioTracks().length > 0) {
        trace('Using audio device: ' + localStream.getAudioTracks()[0].label);
    }

    var servers = null;

    localPeerConnection = new webkitRTCPeerConnection(servers);
    trace("Created local peer connection object localPeerConnection");
    localPeerConnection.onicecandidate = gotLocalIceCandidate;

    remotePeerConnection = new webkitRTCPeerConnection(servers);
    trace("Created remote peer connection object remotePeerConnection");
    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
    remotePeerConnection.onaddstream = gotRemoteStream;

    localPeerConnection.addStream(localStream);
    trace("Added localStream to localPeerConnection");
    localPeerConnection.createOffer(gotLocalDescription);
}

function hangup() {
    trace("Ending call");
    localPeerConnection.close();
    remotePeerConnection.close();
    localPeerConnection = null;
    remotePeerConnection = null;
    hangupButton.disabled = true;
    callButton.disabled = false;
}

// LOCAL ICE CANDIDATE
// EVENT HANDLER CALLED WITHIN THE CALL() FUNCTION
function gotLocalIceCandidate(event) {
    if (event.candidate) {
        remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        trace("Local ICE candidate: \n" + event.candidate.candidate);
    }
}

// REMOTE ICE CANDIDATE
// EVENT HANDLER CALLED WITHIN THE CALL() FUNCTION
function gotRemoteIceCandidate(event) {
    if (event.candidate) {
        localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        trace("Remote ICE candidate: \n " + event.candidate.candidate);
    }
}

// EVENT HANDLER CALLED WITHIN THE CALL() FUNCTION
function gotRemoteStream(event) {
    remoteVideo = document.getElementById("remoteVideo");
    remoteVideo.src = URL.createObjectURL(event.stream);
    trace("Received remote stream");
}

// EVENT HANDLER CALLED WITHIN THE CALL() FUNCTION
function gotLocalDescription(description) {
    localPeerConnection.setLocalDescription(description);
    trace("Offer from localPeerConnection: \n" + description.sdp);
    remotePeerConnection.setRemoteDescription(description);
    remotePeerConnection.createAnswer(gotRemoteDescription);
}

// EVENT HANDLER CALLED WITHIN THE gotLocalDescription() FUNCTION
function gotRemoteDescription(description) {
    remotePeerConnection.setLocalDescription(description);
    trace("Answer from remotePeerConnection: \n" + description.sdp);
    localPeerConnection.setRemoteDescription(description);
}

