app.service('videoChatService', function() {

    function connect() {
        easyrtc.enableDebug(false);
        console.log("Initializing.");
        easyrtc.enableAudio(false);
        //easyrtc.setRoomOccupantListener(convertListToButtons);
        easyrtc.initMediaSource(
            function(){ 	   // success callback
                var selfVideo = document.getElementById("selfVideo");
                easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
                //easyrtc.connect("easyrtc.videoOnly", loginSuccess, loginFailure);
            },
            function(errorCode, errmesg){
                easyrtc.showError("MEDIA-ERROR", errmesg);
            }  // failure callback
        );
    }

    function disconnect() {
        easyrtc.disconnect();
    }

//    function convertListToButtons (roomName, data, isPrimary) {
//        clearConnectList();
//        otherClientDiv = document.getElementById("otherClients");
//        for(var i in data) {
//            var button = document.createElement("button");
//            button.onclick = function(easyrtcid) {
//                return function() {
//                    performCall(easyrtcid);
//                };
//            }(i);
//
//            label = document.createTextNode( easyrtc.idToName(i));
//            button.appendChild(label);
//            otherClientDiv.appendChild(button);
//        }
//        if( !otherClientDiv.hasChildNodes() ) {
//            otherClientDiv.innerHTML = "<em>Nobody else is on...</em>";
//        }
//    }

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
        hide: hideVideoChat
    }
});