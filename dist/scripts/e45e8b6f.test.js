var selfEasyrtcid = '';
function disable(id) {
  document.getElementById(id).disabled = 'disabled';
}
function enable(id) {
  document.getElementById(id).disabled = '';
}
function terminatePage() {
  easyrtc.disconnect();
}
function hangup() {
  easyrtc.hangupAll();
  disable('hangupButton');
}
function clearConnectList() {
  otherClientDiv = document.getElementById('otherClients');
  while (otherClientDiv.hasChildNodes()) {
    otherClientDiv.removeChild(otherClientDiv.lastChild);
  }
}
function convertListToButtons(roomName, data, isPrimary) {
  clearConnectList();
  otherClientDiv = document.getElementById('otherClients');
  for (var i in data) {
    var button = document.createElement('button');
    button.onclick = function (easyrtcid) {
      return function () {
        performCall(easyrtcid);
      };
    }(i);
    label = document.createTextNode(easyrtc.idToName(i));
    button.appendChild(label);
    otherClientDiv.appendChild(button);
  }
  if (!otherClientDiv.hasChildNodes()) {
    otherClientDiv.innerHTML = '<em>Nobody else is on...</em>';
  }
}
function performCall(otherEasyrtcid) {
  easyrtc.hangupAll();
  var acceptedCB = function (accepted, caller) {
    if (!accepted) {
      easyrtc.showError('CALL-REJECTED', 'Sorry, your call to ' + easyrtc.idToName(caller) + ' was rejected');
      enable('otherClients');
    }
  };
  var successCB = function () {
    enable('hangupButton');
  };
  var failureCB = function () {
    enable('otherClients');
  };
  easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
}
function loginSuccess(easyrtcId) {
  disable('connectButton');
  enable('otherClients');
  selfEasyrtcid = easyrtcId;
  document.getElementById('iam').innerHTML = 'I am ' + easyrtcId;
}
function loginFailure(errorCode, message) {
  easyrtc.showError(errorCode, message);
}
function disconnect() {
  document.getElementById('iam').innerHTML = 'logged out';
  easyrtc.disconnect();
  console.log('disconnecting from server');
  enable('connectButton');
  clearConnectList();
  easyrtc.setVideoObjectSrc(document.getElementById('selfVideo'), '');
}