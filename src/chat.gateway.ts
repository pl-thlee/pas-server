import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(81, {
  cors: {
    origin: 'http://localhost:3000',
    // methods: ['GET', 'POST'],
    credential: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  async afterInit(server: Server) {
    console.log('Initialized');
  }
  async handleConnection(socket: Socket) {
    console.log(`Client ${socket.id} connected`);
  }
  async handleDisconnect(socket: Socket) {
    console.log(`Client ${socket.id} disconnected`);
  }

  @SubscribeMessage('connection')
  async joinRoom(socket: Socket) {
    const { roomId } = socket.handshake.query;
    socket.join(roomId);
    console.log(`Client has joined in ${roomId}`);
    socket.to(`roomId`).emit('a new user has joined the room');
  }

  @SubscribeMessage('disconnection')
  async leaveRoom(socket: Socket) {
    const { roomId } = socket.handshake.query;
    socket.to(roomId).emit(`Client ${socket.id} has left the room`);
    socket.disconnect();
  }

  @SubscribeMessage('message')
  handleMessage(socket: Socket, message: string) {
    const { roomId } = socket.handshake.query;
    socket.in(roomId).emit('message', message);
  }
}
