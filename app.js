const env = require('./env');

const sharedLinksController = require('./controllers/SharedLinksController');

(async () => {
  const { app, io, db } = await env.initialize();

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
  await env.run();
})();
