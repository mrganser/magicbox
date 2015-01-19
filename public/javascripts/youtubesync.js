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
	switch(event.data) {
        case YT.PlayerState.PLAYING:
			socket.emit('playvideo', player.getCurrentTime());
            break;
        case YT.PlayerState.PAUSED:
			socket.emit('pausevideo', player.getCurrentTime());
            break;
    }
}

socket.on('playvideo', function(time){
	if (player && player.getPlayerState() != YT.PlayerState.PLAYING) {
		player.seekTo(time);
		player.playVideo();
	}
});

socket.on('pausevideo', function(time){
	if (player && player.getPlayerState() == YT.PlayerState.PLAYING) {
		player.seekTo(time);
		player.pauseVideo();
	}
});