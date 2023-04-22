import { OnModuleInit, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageService } from 'src/app/services/create-message.service';
import { env } from 'src/env';

interface INewMessageBody {
  to: string;
  content: string;
  access_token: string;
}

interface IClientData {
  [x: string]: Socket;
}

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class MyGateway implements OnModuleInit {
  private clients: IClientData;

  constructor(
    private createMessageService: CreateMessageService,
    private jwtService: JwtService,
  ) {
    this.clients = {};
  }

  @WebSocketServer()
  private server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      // console.log(socket);
      console.log('connected');
      try {
        const accessToken = socket.handshake.query['access_token'] as string;
        const { sub: userId } = this.jwtService.verify(accessToken, {
          secret: env.JWT_SECRET,
        });

        this.clients[userId] = socket;
      } catch (e) {
        console.log(e);
      }
    });
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(@MessageBody() body: INewMessageBody) {
    try {
      const { sub: userId } = this.jwtService.verify(body.access_token, {
        secret: env.JWT_SECRET,
      });
      await this.createMessageService.execute({
        fromUserId: userId,
        toUserId: body.to,
        content: body.content,
      });

      const clientTo = this.clients[body.to];
      if (clientTo) {
        clientTo.emit('receivedMessage', {
          fromUserId: userId,
          content: body.content,
        });
      }
    } catch (e) {
      // console.log(e);
    }
  }
}
