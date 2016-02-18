var socket = io();

$(function(){
    var regexYoutube = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
    
    var acceptedTypesOfContent = {
        img: { regex: /^https?:\/\/.*\.(webm|pdf|gif|jpg|jpeg|png)$/i, icon: 'fa-file-image-o' },
        pdf: { regex: /^https?:\/\/.*\.pdf$/i, icon: 'fa-file-pdf-o' },
        webm: { regex: /^https?:\/\/.*\.webm$/i, icon: 'fa-film' },
        youtube: { regex: regexYoutube, icon: 'fa-youtube-play' },
        docs: { regex: /^https:\/\/docs.google.com/i, icon: 'fa-file-text' }        
    };

    function checkCompatibility(link){
        return _.some(_.pluck(_.values(acceptedTypesOfContent), 'regex'), function(regexp){
            return regexp.test(link);
        });
    }

    function isYoutube(link) {
        return _.startsWith(link, 'https://www.youtube.com/embed/');
    }

    function checkForIframe(link){
        return isYoutube(link) || _.endsWith(link, '.webm');
    }

    function reloadEmbedContent(link){
        var magicboxobject = $('#magicboxobject').clone();
        var magicboxiframe = $('#magicboxiframe').clone();
        //Uses iframe for youtube videos // webm and object for the rest of media
        if (checkForIframe(link)){
            magicboxiframe.attr('src', link);
            magicboxiframe.css('visibility', 'visible');
            magicboxobject.attr('data', '');
            magicboxobject.css('visibility', 'hidden');
        } else {
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
        if (isYoutube(link)){
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

    function iconClassForLink(link){
        var classForType = 'fa-arrow-right';  //Default
        _.forEach(_.values(acceptedTypesOfContent), function(typeObject) {
            if (typeObject.regex.test(link)) {
                classForType = typeObject.icon;
            }
        });
        return classForType;    
    }

    function loadLinkOnHistoric(link, date){
        var classForType = iconClassForLink(link);
        $('#messages').append('<li><span class="fa ' + classForType + '"></span> <a onclick="loadPastLink(\'' + link + '\')" title="' + link + '">' + moment(date).format('DD/MM/YYYY HH:mm') + '</a></li>');
    }

    function playAudio(){
        var audio = new Audio('/sounds/notification.ogg');
        audio.play();
    }

    $('#sharelink').click(function(){
        var link = $('#sharedlink').val();
        if (checkCompatibility(link)) { 
            //Transform YouTube's link to correct embed link
            link = link.replace(regexYoutube, 'https://www.youtube.com/embed/$1?enablejsapi=1');

            socket.emit('linkshared', LOCAL_CHANNEL, SECRET, link);

            $('#sharedlink').val('');
            //Disable button for 10 seconds to avoid spamming
            var button = $(this);
            button.attr('disabled', true);
            setTimeout(function() { button.removeAttr('disabled'); }, 3000);
            //Show correct link notification
            $('#correctLink').fadeIn(100).delay(2500).fadeOut();
        } else {
            //Disable button for 3 seconds to avoid spamming
            var button = $(this);
            button.attr('disabled', true);
            setTimeout(function() { button.removeAttr('disabled'); }, 3000);
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


    //Show icon images based on content
    function loadIconsForLinks() {
        $('#messages').children().each(function(){
            var link = this.attr('title');
            var classForType = iconClassForLink(link);
            this.prepend('<span class="fa ' + classForType + '"></span>');
        });
    }
    loadIconsForLinks();

});