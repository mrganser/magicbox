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
			socket.emit('playvideo', LOCAL_CHANNEL, player.getCurrentTime());
            break;
        case YT.PlayerState.PAUSED:
			socket.emit('pausevideo', LOCAL_CHANNEL, player.getCurrentTime());
            break;
    }
}

//Client socket API for youtube events

socket.on('playvideo', function(channel, time){
    if (LOCAL_CHANNEL == channel) {
		if (player && player.getPlayerState() != YT.PlayerState.PLAYING) {
			player.seekTo(time);
			player.playVideo();
		}
	}
});

socket.on('pausevideo', function(channel, time){
    if (LOCAL_CHANNEL == channel) {
		if (player && player.getPlayerState() == YT.PlayerState.PLAYING) {
			player.seekTo(time);
			player.pauseVideo();
		}
	}
});