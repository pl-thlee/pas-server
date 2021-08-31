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
import { Server, Socket } from 'socket.io';

// 포트랑 namespace 설정은 선택사항, 포트 설정 안하면 http랑 동일한 포트 가지게 됨, namespace는 소켓 생성자로 전달되는 속성
@WebSocketGateway(81, { namespace: 'chat' }) 
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway'); // 채팅 게이트웨이가 잘 작동하는지 log찍을때 쓸 변수

  afterInit(server: Server){ // 라이프사이클 중 하나, 라이브러리별 서버 인스턴스를 인수로 사용
    this.logger.log("Initialized!");//최초 연결 로그
  }
  
  handleConnection(client: Socket) {// 라이프사이클 중 하나, 라이브러리 특정 클라이언트 소켓 인스턴스를 인수로 사용
    this.logger.log(`Client connected: ${client.id}`);//누군가 연결할때 로그
  }
  handleDisconnect(client: Socket) {// 라이프사이클 중 하나, 라이브러리 특정 클라이언트 소켓 인스턴스를 인수로 사용
    this.logger.log(`Client disconnected: ${client.id}`);//누군가 연결 끊을때 로그
  }

  @SubscribeMessage('welcome') // welcome을 감지
  connectSomeone( // 누군가 접속할때 처리하는 함수
    @MessageBody() data: string,
  ) {
    const [nickname, room] = data;
    console.log(`${nickname}님이 코드: ${room}방에 접속했습니다.`);
    const comeOn = `${nickname}님이 입장했습니다.`;
    this.server.emit('comeOn' + room, comeOn); // 해당 room에 comeOn 메시지 전달
  }

  private broadcast(event, client, message: any) { // socket.io의 broadcast를 websocket으로 구현, 자신을 제외한 사용자에게 이벤트 전송
    for (let id in this.server.sockets) // 같은 서버 소켓 안에서 id
      if (id !== client.id) this.server.sockets[id].emit(event, message); // 내가 아닌사람에게 event에 해당할때 메시지 전송
  }

  @SubscribeMessage('send') //send 메시지 구독
  sendMessage(@MessageBody() data: string, @ConnectedSocket() client) {
    const [room, nickname, message] = data; // 각 요소를 data에 저장
    console.log(`${client.id} : ${data}`); 
    this.broadcast(room, client, [nickname, message]); // 똑같은 방에 나를 제외한 사람들에게 내 닉네임과 메시지를 보여줌
  }

  
}
