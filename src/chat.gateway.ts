import { Logger } from '@nestjs/common';
import { 
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  OnGatewayInit, 
  SubscribeMessage, 
  WebSocketGateway,
  WebSocketServer,
 } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server){
    this.logger.log("Initialized!");
  }
  handleDisconnect(client: Socket) {
    this.logger.log("Client disconnected: ${client.id")
  }
  handleConnection(client: Socket) {}

  private broadcast(event, client, message:any){ // 메시지 전체 전송
    for(let id in this.server.sockets)
      if(id !== client.id) this.server.sockets[id].emit(event, message);
  }

  @SubscribeMessage('send')
  sendMessage(@MessageBody() data: string, @ConnectedSocket() client) {
    const [room, nickname, message] = data;
    this.broadcast(room,client,[nickname,message])
  }
}
