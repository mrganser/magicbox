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
    //socket.on('register', register_handler(io, socket, session_store, db));
      socket.on('linkshared', function(msg){
        //TODO
        sharedLinksController.new(db, currentChannel, function(err, results){
            if (err){
                console.log(err);
            } else {
                if (results) {
                    console.log(results);
                    io.emit('loadchannel', results);
                }
            }
        });
        io.emit('linkshared', msg);
      });

      socket.on('loadchannel', function(currentChannel) {
        sharedLinksController.find(db, currentChannel, function(err, results){
            if (err){
                console.log(err);
            } else {
                if (results) {
                    console.log(results);
                    io.emit('loadchannel', results);
                }
            }
        });
      });
  });

  //
  // Run the server
  //  
  env.run(function(err) {
    if(err) throw err;
  });
});