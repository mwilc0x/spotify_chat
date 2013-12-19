// Enable user to see their chat history with
// up and down arrow keys
app.directive('chatlog', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            switch(event.which) {
                case 38:
                    // arrow up
                    scope.$apply(function (){
                        if(scope.chat_history_index + 1 == scope.chat_history.length) {
                            scope.text = scope.chat_history[scope.chat_history_index].text;
                        }
                        else {
                            scope.chat_history_index = scope.chat_history_index + 1;
                            scope.text = scope.chat_history[scope.chat_history_index].text;
                        }
                    });
                    event.preventDefault();
                    break;
                case 40:
                    // arrow down
                    scope.$apply(function (){
                        if(scope.chat_history_index - 1 < 0) {
                            scope.text = "";
                            scope.chat_history_index = -1;
                        }
                        else {
                            scope.chat_history_index = scope.chat_history_index - 1;
                            scope.text = scope.chat_history[scope.chat_history_index].text;
                        }
                    });
                    event.preventDefault();
            }
        });
    };
});