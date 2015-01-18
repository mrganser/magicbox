var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('magicboxiframe', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  console.log("Youtube API ready");
}

function onPlayerStateChange(event) {
console.log(event.data);
	if (event.data == 1) {
		socket.emit('playvideo', getVideoTime());
	} else if (event.data == 2) {
		socket.emit('stopvideo', getVideoTime());
	}
}

socket.on('playvideo', function(time){
	player.seekTo(time);
    playVideo();
});

socket.on('stopvideo', function(time){
	player.seekTo(time);
    pauseVideo();
});

function playVideo() {
	player.playVideo();
}

function pauseVideo() {
	player.pauseVideo();
}

function getVideoTime() {
	return player.getCurrentTime();
}