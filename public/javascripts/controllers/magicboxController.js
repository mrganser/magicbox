var socket = io();

$(function(){
    function reloadEmbedContent(link){
        var magicbox = $('#magicboxobject').clone();
        magicbox.attr('data',link);
        $("#magicboxobjectwrapper").empty();
        $("#magicboxobjectwrapper").append(magicbox);
    }
    function loadLinkOnHistoric(link, date){
        $('#messages').prepend('<li><a target="_blank" href="' + link + '">'+ moment(date).format('DD/MM/YYYY HH:mm') + '</a></li>');
    }
    $('#sharelink').click(function(){
        var link = $('#sharedlink').val();
        if (link && (_.endsWith(link, '.pdf') || _.endsWith(link, '.jpg') || _.endsWith(link, '.png') || _.endsWith(link, '.gif')
            || _.startsWith(link, 'https://docs.google.com'))) {
            socket.emit('linkshared', local_channel, $('#sharedlink').val());
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