spotify_chat
============

real time chat and spotify streaming using node, websockets, angularjs and html5 audio

# Demo

Updated working demo at http://spotify-chat.herokuapp.com/ ... check it
out!

# Running Locally

Right now I have it setup so that you need a spotify premium account to run. If you do you'll have to
enter your credentials in server.js. I plan to change this in the future so that it is not dependant upon
the service, this was more for demo purposes.

``` bash
npm install
grunt build
foreman start
```

# Running on Heroku

``` bash
heroku create
heroku labs:enable websockets
git push heroku master
heroku open
```
