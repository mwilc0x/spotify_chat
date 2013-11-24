'use strict';

  app.controller('MainCtrl', function MainCtrl($scope, $modal) {
        $scope.host = location.origin.replace(/^http/, 'ws');
        $scope.ws = new WebSocket($scope.host);

        $scope.user = {};
        $scope.current_users = [{data: 0, name: "Bot", id: 0}];
        $scope.text = "";
        $scope.messages =  [{
            name: "Bot",
            text: "Welcome! Play music by entering artist or song name"
        }];
        $scope.chat_history = [{text: ""}];
        $scope.chat_history_index = -1;

        $scope.chatInputFocused = false;

        $scope.loseFocus = function() {
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
                    if($scope.current_users[i].id == $scope.user.id) {
                        $scope.current_users[i].name = nickname;
                    }
                }

                $scope.chatInputFocused = true;

                $scope.user.name = nickname;
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        // messages from node server
        $scope.ws.onmessage = function (event) {
            var server_response = JSON.parse(event.data);

            if(server_response != null && server_response.data != null) {
                switch(server_response.data) {
                    case 0: // user information
                        $scope.user = server_response;
                        $scope.current_users.push(server_response);
                        console.log("new user joined");
                        break;
                    case 1: // song information
                        if($scope.audio != null) {
                            $scope.audio.pause();
                        }

                        $scope.audio = new Audio;
                        $scope.audio.src = "/audio/" + server_response.song;
                        $scope.audio.autoplay = true;
                        $scope.audio.controls = true;
                        console.log("audio started");
                        break;
                }
            }
        };

        $scope.submit = function() {
             if (this.text) {
                 $scope.ws.send(this.text);
                 $scope.chat_history.unshift({text: this.text});
                 $scope.messages.push({name: $scope.user.name, text: this.text});
                 $scope.text = "";
             }
        };

        // page load
        var init = function () {
            $scope.open();
        };
        init();
  });