var socket = io();
$(function(){
    $('#sharelink').click(function(){
      if($('#sharedlink').val()){
        socket.emit('linkshared', $('#sharedlink').val());
        $('#sharedlink').val('');          
      }
    });
    socket.on('linkshared', function(msg){
      var magicbox = $('#magicboxobject').clone();
      magicbox.attr('data',msg);
      $("#magicboxobjectwrapper").empty();
      $("#magicboxobjectwrapper").append(magicbox);
      var currentDate = new Date();
      $('#messages').prepend('<li>' + currentDate.getDate() 
        + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear() + ': <a target="_blank" href="' 
        + msg + '">Link</a></li>');
    });
    socket.on('loadchannel', function(links){
        for (var i=0; i<links.length; i++) {
          var date = new Date(links[i].date);
            $('#messages').prepend('<li>' + date.getDate() 
              + '/' + date.getMonth() + '/' + date.getFullYear() 
              + ': <a target="_blank" href="' + links[i].link + '">Link</a></li>');
          
        }
    });
});
$("#magicboxhistoric").ready(function() {
    socket.emit('loadchannel', 1);
});