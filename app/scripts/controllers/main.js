'use strict';

app.controller('MainCtrl', function MainCtrl($log, $scope, $modal, messageType, chatService, audio) {
    $scope.user = {};
    $scope.current_users = [{ data: 0, name: "Bot", id: 0 }];
    $scope.text = "";
    $scope.messages = [{
        name: "Bot",
        text: 'Welcome! To play a song, type !spotify song or artist'
    }];
    $scope.chat_history = [{ text: "" }];
    $scope.chat_history_index = -1;

    $scope.chatInputFocused = false;

    $scope.loseFocus = function () {
        $scope.chatInputFocused = false;
    };

    // opening || closing of modal window
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/register.html',
            controller: 'modalController'
        });

        modalInstance.result.then(function (nickname) {
            for (var i = 0; i < $scope.current_users.length; i++) {
                if ($scope.current_users[i].id == $scope.user.id) {
                    $scope.current_users[i].name = nickname;
                }
            }

            $scope.chatInputFocused = true;

            $scope.user.name = nickname;
        }, function () {
            $log.log('Modal dismissed at: ' + new Date());
        });
    };

    function onUserJoined(user) {
        $scope.user = user;
        $scope.current_users.push(user);
        $log.log("new user joined");
        $scope.$apply();
    }

    function onSongRequested(songRequest) {
        $log.log("in audio case song: " + songRequest.song + " user: " + songRequest.user);
        audio.play("/audio/" + songRequest.song);
        $scope.messages.push({ name: songRequest.user, text: songRequest.song });
        $log.log("audio started");
        $scope.$apply();
    }

    function onChatMessageReceived(message) {
        $scope.messages.push({ name: message.user, text: message.text });
        $scope.$apply();
    }

    $scope.$on('userJoined', function (evt, user) { onUserJoined(user); });
    $scope.$on('songRequested', function (evt, songRequest) { onSongRequested(songRequest); });
    $scope.$on('chatMessageReceived', function (evt, message) { onChatMessageReceived(message); });

    $scope.submit = function () {
        if (this.text) {
            var msgType = messageType.decipher(this.text);
            var message = JSON.stringify({ data: msgType.data, text: msgType.text, user: $scope.user.name });
            chatService.send(message);
            $scope.chat_history.unshift({ text: this.text });
            $scope.text = "";
        }
    };

    // page load
    var init = function () {
        $scope.open();
    };
    init();
});