import { Server as SocketIOServer, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../types/socket-events';

const prisma = new PrismaClient();

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedIO = SocketIOServer<ClientToServerEvents, ServerToClientEvents>;

export function setupSocketHandlers(io: TypedIO) {
  io.on('connection', (socket: TypedSocket) => {
    console.log('Client connected:', socket.id);

    socket.on('linkshared', async (channel, secret, link) => {
      try {
        const newLink = await prisma.sharedLink.create({
          data: { channel, secret, link },
        });
        io.emit('linkshared', channel, secret, link, newLink.createdAt);
      } catch (error) {
        console.error('Error saving link:', error);
      }
    });

    socket.on('linkchanged', (channel, secret, link) => {
      socket.broadcast.emit('linkchanged', channel, secret, link);
    });

    socket.on('playvideo', (channel, time) => {
      socket.broadcast.emit('playvideo', channel, time);
    });

    socket.on('pausevideo', (channel, time) => {
      socket.broadcast.emit('pausevideo', channel, time);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
