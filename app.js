var env = require('./env');

var sharedLinksController = require('./controllers/SharedLinksController');

env.initialize(function(err, app, io, db) {  
    if(err) throw err;

    //
    // http routes
    //
    //app.get('/', main_controller.index());

    //
    // Websocket api
    //
    io.sockets.on('connection', function (socket) {
        socket.on('linkshared', function(channel, msg){ sharedLinksController.new(channel, msg, db, io); });
        socket.on('playvideo', function(time){ socket.broadcast.emit('playvideo', time); });
        socket.on('pausevideo', function(time){ socket.broadcast.emit('pausevideo', time); });        
    });

    //
    // Run the server
    //  
    env.run(function(err) {
        if(err) throw err;
    });
});