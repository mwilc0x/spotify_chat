'use strict';

app.controller('MainCtrl', function MainCtrl($log, $scope, $modal, messageType, chatService, audio) {
    $scope.user = {};
    $scope.current_users = { data: 0, users: []};
    $scope.text = "";
    $scope.messages = [{
        name: "Bot",
        text: 'Welcome! To play a song, type "bot play song or artist"'
    }];
    $scope.chat_history = [{ text: "" }];
    $scope.chat_history_index = -1;
    $scope.loggedIn = false;
    $scope.url = null;
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
            for (var i = 0; i < $scope.current_users.users.length; i++) {
                if ($scope.current_users.users[i].id == $scope.user.id) {
                    $scope.current_users.users[i].name = nickname;
                    break;
                }
            }

            // broadcast nick change to server and everyone in chat room
            var message = JSON.stringify({ data: 3, name: nickname, id: $scope.user.id });
            chatService.send(message);

            $scope.chatInputFocused = true;

            $scope.user.name = nickname;
        }, function () {
            $log.log('Modal dismissed at: ' + new Date());
        });
    };

    function onUserList(users) {
        $scope.current_users = users.users;
        $scope.$apply();
    }

    function onUserJoined(user) {
        if(!$scope.loggedIn){
            $scope.user = user;
            $scope.loggedIn = true;
        }

        $scope.current_users.users.push(user);
        $log.log("new user joined");
        $scope.$apply();
    }

    function onUserLeft(user) {
        for (var i = 0; i < $scope.current_users.users.length; i++) {
            if ($scope.current_users.users[i].id == user.id) {
                $scope.current_users.users.splice(i,1);
                break;
            }
        }
        $scope.$apply();
    }

    function onSongRequested(songRequest) {
        $log.log("in audio case song: " + songRequest.song + " user: " + songRequest.user);
        $log.log(songRequest);
        $scope.currentSong = { url: "/audio/" + songRequest.song , title: songRequest.title };
        $scope.messages.push({ name: songRequest.user, text: "Now playing " + songRequest.title });
        $log.log("audio started");
        $scope.$apply();
        chatService.scroll();
    }

    function onChatMessageReceived(message) {
        $scope.messages.push({ name: message.user, text: message.text });
        $scope.$apply();
        chatService.scroll();
    }

    function onUserUpdatedInfo(user) {
        for (var i = 0; i < $scope.current_users.users.length; i++) {
            if ($scope.current_users.users[i].id == user.id) {
                $scope.current_users.users[i].name = user.name;
                break;
            }
        }
        $scope.$apply();
    }

    $scope.$on('userList', function (evt, users) { onUserList(users); });
    $scope.$on('userJoined', function (evt, user) { onUserJoined(user); });
    $scope.$on('userLeft', function (evt, user) { onUserLeft(user); });
    $scope.$on('songRequested', function (evt, songRequest) { onSongRequested(songRequest); });
    $scope.$on('chatMessageReceived', function (evt, message) { onChatMessageReceived(message); });
    $scope.$on('userUpdatedInfo', function (evt, user) { onUserUpdatedInfo(user); })

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