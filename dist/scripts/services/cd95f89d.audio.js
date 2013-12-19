app.service('audio', function () {

    var audio;

    function play(url) {

        if (audio != null) {
            audio.pause();
        }

        audio = new Audio;
        audio.src = url;
        audio.autoplay = true;
        audio.controls = true;
    }

    return {
        play: play
    };

});