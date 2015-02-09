var socket = io();

$(function(){
    var regexYoutube = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
    
    function reloadEmbedContent(link){
        var magicboxobject = $('#magicboxobject').clone();
        var magicboxiframe = $('#magicboxiframe').clone();
        //Uses iframe for youtube videos and object for the rest of media
        if (_.startsWith(link, 'https://www.youtube.com/embed/')){
            magicboxiframe.attr('src', link);
            magicboxiframe.css('visibility', 'visible');
            magicboxobject.attr('data', '');
            magicboxobject.css('visibility', 'hidden');
        } else{
            magicboxobject.attr('data', link);
            magicboxobject.css('visibility', 'visible');
            magicboxiframe.attr('src', '');
            magicboxiframe.css('visibility', 'hidden');     
        }
        $('#magicboxobject').remove();
        $('#magicboxiframe').remove();
        $("#magicboxobjectwrapper").append(magicboxobject);   
        $("#magicboxobjectwrapper").append(magicboxiframe);
        //Reload Youtube's API
        if (_.startsWith(link, 'https://www.youtube.com/embed/')){
            onYouTubeIframeAPIReady();
        }
        //Color selected links
        $("#messages > li").css("background-color", ""); 
        $("a[title='" + link + "']").parent().css("background-color", "#449D44"); 
    }

    loadPastLink = function (link){
        reloadEmbedContent(link);
        socket.emit('linkchanged', LOCAL_CHANNEL, SECRET, link);
    }

    function loadLinkOnHistoric(link, date){
        $('#messages').append('<li><a target="_blank" href="' + link + '">'+ moment(date).format('DD/MM/YYYY HH:mm') + '</a></li>');
    }

    function playAudio(){
        var audio = new Audio('/sounds/notification.ogg');
        audio.play();
    }

    $('#sharelink').click(function(){
        var link = $('#sharedlink').val();
        if (link && (_.endsWith(link, '.pdf') || _.endsWith(link, '.jpg') || _.endsWith(link, '.png') || _.endsWith(link, '.gif')  //Media
                 || _.startsWith(link, 'https://docs.google.com') //Google docs
                 || link.match(regexYoutube))) {  //Youtube
            
            link = link.replace(regexYoutube, 'https://www.youtube.com/embed/$1?enablejsapi=1');  //Transform YouTube's link to correct embed link
            socket.emit('linkshared', LOCAL_CHANNEL, SECRET, link);

            $('#sharedlink').val('');
            //Disable button for 10 seconds to avoid spamming
            var button = $(this);
            button.attr("disabled", true);
            setTimeout(function() { button.removeAttr("disabled"); }, 3000);
            //Show correct link notification
            $('#correctLink').fadeIn(100).delay(2500).fadeOut();
        } else {
            //Disable button for 3 seconds to avoid spamming
            var button = $(this);
            button.attr("disabled", true);
            setTimeout(function() { button.removeAttr("disabled"); }, 3000);
            //Show invalid link notification
            $('#invalidLink').fadeIn(100).delay(2500).fadeOut();
        }
    });
    
    //Client socket API for linkshared event
    socket.on('linkshared', function(channel, secret, link, date){
        if (LOCAL_CHANNEL == channel && SECRET == secret) {
            loadLinkOnHistoric(link, date);
            reloadEmbedContent(link);
            playAudio();
        }
    });
    
    //Client socket API for linkchanged event
    socket.on('linkchanged', function(channel, secret, link){
        if (LOCAL_CHANNEL == channel && SECRET == secret) {
            reloadEmbedContent(link);
        }
    });
});