import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AddFriendService } from 'src/app/services/add-friend.service';
import { CreateMessageService } from 'src/app/services/create-message.service';
import { GetFriendsService } from 'src/app/services/get-friends.service';
import { GetUserService } from 'src/app/services/get-user.service';
import { VisualizeMessagesService } from 'src/app/services/visualize-messages.service';
import { env } from 'src/env';

interface INewMessageBody {
  toUserId: string;
  content: string;
  access_token: string;
}

interface IVisualizeChatBody {
  fromUserId: string;
  access_token: string;
}

interface IClientData {
  [x: string]: string;
}

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class MyGateway implements OnModuleInit {
  private usersSocketsIds: IClientData;

  constructor(
    private createMessageService: CreateMessageService,
    private getFriendsService: GetFriendsService,
    private visualizeMessagesService: VisualizeMessagesService,
    private getUserService: GetUserService,
    private addFriendService: AddFriendService,
    private jwtService: JwtService,
  ) {
    this.usersSocketsIds = {};
  }

  @WebSocketServer()
  private server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      // console.log(socket);
      // console.log('connected');
      try {
        const accessToken = socket.handshake.query['access_token'] as string;
        const { sub: userId } = this.jwtService.verify(accessToken, {
          secret: env.JWT_SECRET,
        });

        this.usersSocketsIds[userId] = socket.id;
      } catch (e) {
        console.log(e);
      }
    });
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(
    @MessageBody() body: INewMessageBody,
    @ConnectedSocket() fromClient: Socket,
  ) {
    try {
      const { sub: fromUserId } = this.jwtService.verify(body.access_token, {
        secret: env.JWT_SECRET,
      });

      await this.createMessageService.execute({
        fromUserId,
        toUserId: body.toUserId,
        content: body.content,
      });

      // Emiting event for user that sent message
      fromClient.emit('handleCreatedMessage', {
        fromUserId,
        toUserId: body.toUserId,
        content: body.content,
      });

      const friendsOfReceiver = await this.getFriendsService.execute(
        body.toUserId,
      );
      const areTheyFriends = friendsOfReceiver.data.filter((friend) => {
        return friend.id === fromUserId;
      })[0];
      if (!areTheyFriends) {
        const friend = await this.getUserService.execute({
          userId: fromUserId,
        });
        await this.addFriendService.execute({
          userId: body.toUserId,
          friendEmail: friend.email,
        });
      }

      // Emiting event for user that received message
      const receiverSocketId = this.usersSocketsIds[body.toUserId];
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('handleCreatedMessage', {
          fromUserId,
          toUserId: body.toUserId,
          content: body.content,
        });
      }
    } catch (e) {
      // console.log(e);
    }
  }

  @SubscribeMessage('visualizeChat')
  async onVisualizeMessage(@MessageBody() body: IVisualizeChatBody) {
    try {
      const { sub: userId } = this.jwtService.verify(body.access_token, {
        secret: env.JWT_SECRET,
      });

      await this.visualizeMessagesService.execute({
        fromUserId: body.fromUserId,
        userId,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
