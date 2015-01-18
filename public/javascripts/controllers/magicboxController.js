var socket = io();

$(function(){
    var regexYoutube = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
    function reloadEmbedContent(link){
        var magicboxobject = $('#magicboxobject').clone();
        var magicboxiframe = $('#magicboxiframe').clone();
        if (_.startsWith(link, 'https://www.youtube.com/embed/')){
            magicboxiframe.attr('src', link);
            magicboxobject.attr('data', '');
        } else{
            magicboxobject.attr('data', link);
            magicboxiframe.attr('src', '');       
        }
        $('#magicboxobject').remove();
        $('#magicboxiframe').remove();
        $("#magicboxobjectwrapper").append(magicboxobject);   
        $("#magicboxobjectwrapper").append(magicboxiframe);
        if (_.startsWith(link, 'https://www.youtube.com/embed/')){
            onYouTubeIframeAPIReady();
        }
    }
    function loadLinkOnHistoric(link, date){
        $('#messages').prepend('<li><a target="_blank" href="' + link + '">'+ moment(date).format('DD/MM/YYYY HH:mm') + '</a></li>');
    }
    $('#sharelink').click(function(){
        var link = $('#sharedlink').val();
        if (link && (_.endsWith(link, '.pdf') || _.endsWith(link, '.jpg') || _.endsWith(link, '.png') || _.endsWith(link, '.gif')
            || _.startsWith(link, 'https://docs.google.com') 
            || link.match(regexYoutube))) {
            link = link.replace(regexYoutube, 'https://www.youtube.com/embed/$1?enablejsapi=1');
            socket.emit('linkshared', local_channel, link);
            $('#sharedlink').val('');
            var button = $(this);
            button.attr("disabled", true);
            setTimeout(function() { button.removeAttr("disabled"); }, 10000);
            $('#correctLink').fadeIn(100).delay(2500).fadeOut();
        } else {
            $('#invalidLink').fadeIn(100).delay(2500).fadeOut();
        }
    });
    socket.on('linkshared', function(link, date){
        loadLinkOnHistoric(link, date);
        reloadEmbedContent(link);
    });
});