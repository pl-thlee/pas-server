import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
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

  afterInit() {
    console.log('Initialized!');
  }

  async handleConnection(socket: Socket) {
    console.log(`Client ${socket.id} connected`);
    const { roomID } = socket.handshake.query;
    socket.join(roomID);
    console.log(`Client has joined ${roomID}`);
    await this.server
      .to(roomID)
      .emit('connection', 'a new user has joined the room');
  }

  async handleDisconnect(socket: Socket) {
    console.log(`Client ${socket.id} disconnected`);
    const { roomID } = socket.handshake.query;
    // console.log(``);
    console.log(`Client has left ${roomID}`);
    this.server
      .to(roomID)
      .emit('disconnect', `Client ${socket.id} has left the room`);
    await socket.disconnect();
  }

  // @SubscribeMessage('connection')
  // async joinRoom(socket: Socket) {}

  // @SubscribeMessage('disconnect')
  // async leaveRoom(socket: Socket) {}

  @SubscribeMessage('message')
  async sendMessage(socket: Socket, message: string) {
    const { roomID } = socket.handshake.query;
    console.log(`Client has sent ${message}`);
    await socket.in(roomID).emit('message', message);
  }

  // @SubscribeMessage('connection')
  // async joinRoom(socket: Socket) {
  //   console.log(`Client ${socket.id} connected`);
  //   const { roomID } = socket.handshake.query;
  //   socket.join(roomID);
  // }

  // @SubscribeMessage('message')
  // sendMessage(socket: Socket, message: string) {
  //   const { roomID } = socket.handshake.query;
  //   console.log(`Client has sent ${message}`);
  //   socket.to(roomID).emit('message', message);
  // }
}
