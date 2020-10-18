var env = require('./env');

var sharedLinksController = require('./controllers/SharedLinksController');

env.initialize(function (err, app, io, db) {
  if (err) throw err;

  // Websocket api
  io.sockets.on('connection', function (socket) {
    socket.on('linkshared', function (channel, secret, link) {
      sharedLinksController.new(channel, secret, link, db, io);
    });
    socket.on('linkchanged', function (channel, secret, link) {
      socket.broadcast.emit('linkchanged', channel, secret, link);
    });
    socket.on('playvideo', function (channel, time) {
      socket.broadcast.emit('playvideo', channel, time);
    });
    socket.on('pausevideo', function (channel, time) {
      socket.broadcast.emit('pausevideo', channel, time);
    });
  });

  // Run the server
  env.run(function (err) {
    if (err) throw err;
  });
});
