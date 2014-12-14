var env = require('./env');

var sharedLinksController = require('./controllers/SharedLinksController');

env.initialize(function(err, app, io, db) {  
    if(err) throw err;

    //
    // http routes
    //
    //app.get('/', main_controller.index());

    //
    // websocket api end point handlers (our API)
    //
    io.sockets.on('connection', function (socket) {
        socket.on('linkshared', function(msg){ sharedLinksController.new(msg, db, io)});
    });

    //
    // Run the server
    //  
    env.run(function(err) {
        if(err) throw err;
    });
});