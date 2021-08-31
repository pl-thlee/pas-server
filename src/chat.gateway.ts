import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server){
    this.logger.log("Initialized!");
  }
  handleDisconnect(client: Socket) {}
  handleConnection(client: Socket) {}

  @SubscribeMessage('send')
  sendMessage(client: Socket, message: string) {
    return {event: 'send', data: message};
  }
}
