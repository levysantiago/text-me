import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  private server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket);
      console.log('connected');
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body) {
    console.log(body);
  }
}
