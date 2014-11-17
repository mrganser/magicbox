var socket = io();

$(function(){
    function reloadEmbedContent(link){
        var magicbox = $('#magicboxobject').clone();
        magicbox.attr('data',link);
        $("#magicboxobjectwrapper").empty();
        $("#magicboxobjectwrapper").append(magicbox);
    }
    function loadLinkOnHistoric(link, date){
        $('#messages').prepend('<li>' + date.getDate() 
            + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' 
            + date.getHours() + ':' + date.getMinutes()
            + ': <a target="_blank" href="' 
            + link + '">Link</a></li>');
    }
    $('#sharelink').click(function(){
        if($('#sharedlink').val()){
            socket.emit('linkshared', $('#sharedlink').val());
            $('#sharedlink').val('');          
        }
    });
    socket.on('linkshared', function(link){
        loadLinkOnHistoric(link, new Date());
        reloadEmbedContent(link);
    });
    socket.on('loadchannel', function(links){
        for (var i=0; i<links.length; i++) {
            loadLinkOnHistoric(links[i].link, new Date(links[i].date));
        }
        reloadEmbedContent(links[links.length - 1].link);
    });

        //Load channel when you enter
        socket.emit('loadchannel', 1);
    });