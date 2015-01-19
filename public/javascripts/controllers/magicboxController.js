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
    }

    function loadLinkOnHistoric(link, date){
        $('#messages').prepend('<li><a target="_blank" href="' + link + '">'+ moment(date).format('DD/MM/YYYY HH:mm') + '</a></li>');
    }

    $('#sharelink').click(function(){
        var link = $('#sharedlink').val();
        if (link && (_.endsWith(link, '.pdf') || _.endsWith(link, '.jpg') || _.endsWith(link, '.png') || _.endsWith(link, '.gif')  //Media
                 || _.startsWith(link, 'https://docs.google.com') //Google docs
                 || link.match(regexYoutube))) {  //Youtube
            
            link = link.replace(regexYoutube, 'https://www.youtube.com/embed/$1?enablejsapi=1');  //Transform YouTube's link to correct embed link
            socket.emit('linkshared', LOCAL_CHANNEL, link);

            $('#sharedlink').val('');
            //Disable button for 10 seconds to avoid spamming
            var button = $(this);
            button.attr("disabled", true);
            setTimeout(function() { button.removeAttr("disabled"); }, 10000);
            //Show correct link notification
            $('#correctLink').fadeIn(100).delay(2500).fadeOut();
        } else {
            //Show invalid link notification
            $('#invalidLink').fadeIn(100).delay(2500).fadeOut();
        }
    });
    
    //Client socket API for linkshared event
    socket.on('linkshared', function(channel, link, date){
        if (LOCAL_CHANNEL == channel) {
            loadLinkOnHistoric(link, date);
            reloadEmbedContent(link);
        }
    });
});