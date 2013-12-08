app.service('videoChatService', function() {

    var selfEasyrtcid = "";

    function disable(id) {
        document.getElementById(id).disabled = "disabled";
    }


    function enable(id) {
        document.getElementById(id).disabled = "";
    }

    function connect() {
        easyrtc.enableDebug(false);
        console.log("Initializing.");
        easyrtc.enableAudio(false);
        easyrtc.setRoomOccupantListener(convertListToButtons);
        easyrtc.initMediaSource(
            function(){ 	   // success callback
                var selfVideo = document.getElementById("selfVideo");
                easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
                easyrtc.connect("easyrtc.videoOnly", loginSuccess, loginFailure);
            },
            function(errorCode, errmesg){
                easyrtc.showError("MEDIA-ERROR", errmesg);
            }  // failure callback
        );
    }

    function terminatePage() {
        easyrtc.disconnect();
    }

    function hangup() {
        easyrtc.hangupAll();
        disable("hangupButton");
    }


    function clearConnectList() {
        otherClientDiv = document.getElementById("otherClients");
        while (otherClientDiv.hasChildNodes()) {
            otherClientDiv.removeChild(otherClientDiv.lastChild);
        }

    }

    function convertListToButtons (roomName, data, isPrimary) {
        clearConnectList();
        otherClientDiv = document.getElementById("otherClients");
        for(var i in data) {
            var button = document.createElement("button");
            button.onclick = function(easyrtcid) {
                return function() {
                    performCall(easyrtcid);
                };
            }(i);

            label = document.createTextNode( easyrtc.idToName(i));
            button.appendChild(label);
            otherClientDiv.appendChild(button);
        }
        if( !otherClientDiv.hasChildNodes() ) {
            otherClientDiv.innerHTML = "<em>Nobody else is on...</em>";
        }
    }


    function performCall(otherEasyrtcid) {
        easyrtc.hangupAll();
        var acceptedCB = function(accepted, caller) {
            if( !accepted ) {
                easyrtc.showError("CALL-REJECTED", "Sorry, your call to " + easyrtc.idToName(caller) + " was rejected");
                enable("otherClients");
            }
        };
        var successCB = function() {
            enable("hangupButton");
        };
        var failureCB = function() {
            enable("otherClients");
        };
        easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
    }


    function loginSuccess(easyrtcId) {
        disable("connectButton");
        // enable("disconnectButton");
        enable("otherClients");
        selfEasyrtcid = easyrtcId;
        document.getElementById("iam").innerHTML = "I am " + easyrtcId;
    }


    function loginFailure(errorCode, message) {
        easyrtc.showError(errorCode, message);
    }

    function disconnect() {
        document.getElementById("iam").innerHTML = "logged out";
        easyrtc.disconnect();
        console.log("disconnecting from server");
        enable("connectButton");
        // disable("disconnectButton");
        clearConnectList();
        easyrtc.setVideoObjectSrc(document.getElementById("selfVideo"), "");
    }


    easyrtc.setStreamAcceptor( function(caller, stream) {
        var video = document.getElementById("callerVideo");
        easyrtc.setVideoObjectSrc(video,stream);
        console.log("saw video from " + caller);
        enable("hangupButton");
    });


    easyrtc.setOnStreamClosed( function (caller) {
        easyrtc.setVideoObjectSrc(document.getElementById("callerVideo"), "");
        disable("hangupButton");
    });


    easyrtc.setAcceptChecker(function(caller, cb) {
        document.getElementById("acceptCallBox").style.display = "block";
        if( easyrtc.getConnectionCount() > 0 ) {
            document.getElementById("acceptCallLabel").innerHTML = "Drop current call and accept new from " + easyrtc.idToName(caller) + " ?";
        }
        else {
            document.getElementById("acceptCallLabel").innerHTML = "Accept incoming call from " + easyrtc.idToName(caller) +  " ?";
        }
        var acceptTheCall = function(wasAccepted) {
            document.getElementById("acceptCallBox").style.display = "none";
            if( wasAccepted && easyrtc.getConnectionCount() > 0 ) {
                easyrtc.hangupAll();
            }
            cb(wasAccepted);
        };
        document.getElementById("callAcceptButton").onclick = function() {
            acceptTheCall(true);
        };
        document.getElementById("callRejectButton").onclick =function() {
            acceptTheCall(false);
        };
    } );

    function showVideoChat() {
        var chatDiv = document.getElementById("chat");
        var chatWindow = chatDiv.getElementsByClassName("messages");
        var input = chatDiv.getElementsByClassName("chat-input");

        chatWindow[0].style.height = "54%";
        chatWindow[0].style.maxHeight = "56%";
        input[0].style.position = "relative";
    }

    function hideVideoChat() {
        var chatDiv = document.getElementById("chat");
        var chatWindow = chatDiv.getElementsByClassName("messages");
        var input = chatDiv.getElementsByClassName("chat-input");

        chatWindow[0].style.height = "90%";
        chatWindow[0].style.maxHeight = "91%";
        input[0].style.position = "absolute";
    }

    return {
        connect: connect,
        disconnect: disconnect,
        show: showVideoChat,
        hide: hideVideoChat,
        hangup: hangup
    }
});