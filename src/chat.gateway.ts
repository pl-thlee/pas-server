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

  @SubscribeMessage('message')
  handleMessage(socket: Socket, message: string) {
    const { roomId } = socket.handshake.query;
    socket.in(roomId).emit('message', message);
  }
}
