import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit{

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any){
    this.logger.log("Initialized!");
  }
  
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
