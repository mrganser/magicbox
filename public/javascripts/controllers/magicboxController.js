var socket = io();

$(function(){
    function reloadEmbedContent(link){
        var magicbox = $('#magicboxobject').clone();
        magicbox.attr('data',link);
        $("#magicboxobjectwrapper").empty();
        $("#magicboxobjectwrapper").append(magicbox);
    }
    function loadLinkOnHistoric(link, date){
        $('#messages').prepend('<li>' + moment(date).format('DD/MM/YYYY HH:mm') 
            + ': <a target="_blank" href="' + link + '">Link</a></li>');
    }
    $('#sharelink').click(function(){
        var link = $('#sharedlink').val();
        if (link && (_.endsWith(link, '.pdf') || _.endsWith(link, '.jpg') || _.endsWith(link, '.png')
            || _.endsWith(link, '.pdf') || _.startsWith(link, 'https://docs.google.com'))) {
            socket.emit('linkshared', $('#sharedlink').val());
            $('#sharedlink').val('');
            $('#correctLink').fadeIn(100).delay(2500).fadeOut();
        } else {
            $('#invalidLink').fadeIn(100).delay(2500).fadeOut();
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