var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player,
  comesFromSocket = false;

function onYouTubeIframeAPIReady() {
  if (document.getElementById("magicboxiframe").getAttribute("src")) {
    player = new YT.Player("magicboxiframe", {
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  }
}

function onPlayerReady() {
  console.log("Youtube API ready");
}

function onPlayerStateChange(event) {
  if (!comesFromSocket) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        socket.emit("playvideo", LOCAL_CHANNEL, player.getCurrentTime());
        break;
      case YT.PlayerState.PAUSED:
        socket.emit("pausevideo", LOCAL_CHANNEL, player.getCurrentTime());
        break;
    }
  } else {
    if (event.data == YT.PlayerState.PLAYING || event.data == YT.PlayerState.PAUSED) {
      comesFromSocket = false;
    }
  }
}

//Client socket API for youtube events

socket.on("playvideo", function(channel, time) {
  if (LOCAL_CHANNEL == channel) {
    if (player && player.getPlayerState() != YT.PlayerState.PLAYING) {
      comesFromSocket = true;
      player.seekTo(time);
      player.playVideo();
    }
  }
});

socket.on("pausevideo", function(channel, time) {
  if (LOCAL_CHANNEL == channel) {
    if (player && player.getPlayerState() == YT.PlayerState.PLAYING) {
      comesFromSocket = true;
      player.seekTo(time);
      player.pauseVideo();
    }
  }
});
