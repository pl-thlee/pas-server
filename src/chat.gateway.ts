import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit{

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any){
    this.logger.log("Initialized!");
  }

  @SubscribeMessage('send')
  sendMessage(client: Socket, message: string) {
    return {event: 'msgToClient', data: message};
  }
}
