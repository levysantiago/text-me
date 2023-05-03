import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as moment from 'moment';
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

interface ITypingBody {
  toUserId: string;
  access_token: string;
}

interface IClientData {
  [x: string]: string;
}

interface IClientInterval {
  [x: string]: { interval: NodeJS.Timer; lastTypingTime: Date | undefined };
}

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  private server: Server;

  private usersSocketsIds: IClientData;

  private usersIntervals: IClientInterval;

  constructor(
    private createMessageService: CreateMessageService,
    private getFriendsService: GetFriendsService,
    private visualizeMessagesService: VisualizeMessagesService,
    private getUserService: GetUserService,
    private addFriendService: AddFriendService,
    private jwtService: JwtService,
  ) {
    this.usersSocketsIds = {};
    this.usersIntervals = {};
  }

  /**
   * Iniciating connection when module is initialized
   */
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

  /**
   * Event subscription that handles a new message creation.
   * After creating the messages, emits the "handleCreatedMessage"
   * event to update the client messages and "friendStoppedTyping" event
   * to warn the user that his/her friend stoped typing.
   * @param body The data needed to create the message
   * @param fromClient Who sent the message
   */
  @SubscribeMessage('newMessage')
  async onNewMessage(
    @MessageBody() body: INewMessageBody,
    @ConnectedSocket() fromClient: Socket,
  ) {
    try {
      // Verifying access token
      const { sub: fromUserId } = this.jwtService.verify(body.access_token, {
        secret: env.JWT_SECRET,
      });

      // Creating message
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

      //Getting the friends of user receiver to verify if the message sender
      // is his/her friend
      const friendsOfReceiver = await this.getFriendsService.execute(
        body.toUserId,
      );
      // Verifying if users are friends
      const areTheyFriends = friendsOfReceiver.data.filter((friend) => {
        return friend.id === fromUserId;
      })[0];
      if (!areTheyFriends) {
        // If they are not friends, we create a friendship between them
        // Obtaining the friend user
        const friend = await this.getUserService.execute({
          userId: fromUserId,
        });
        // Creating friendship
        await this.addFriendService.execute({
          userId: body.toUserId,
          friendEmail: friend.email,
        });
      }

      // Getting the user receiver socket id
      const receiverSocketId = this.usersSocketsIds[body.toUserId];
      if (receiverSocketId) {
        // Emiting event for user that received message
        this.server.to(receiverSocketId).emit('handleCreatedMessage', {
          fromUserId,
          toUserId: body.toUserId,
          content: body.content,
        });
        // Emitting event to user receiver that his friend stoped typing
        this.server.to(receiverSocketId).emit('friendStoppedTyping', {
          fromUserId,
        });
      }
      // Clearing typing verifier interval
      clearInterval(this.usersIntervals[fromUserId].interval);
      // Reseting interval and lastTypingTime
      this.usersIntervals[fromUserId].interval = undefined;
      this.usersIntervals[fromUserId].lastTypingTime = undefined;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Event submiscription used to define all users messages received as
   * visualized. This must be emitted when the user opens the chat page.
   * @param body The data needed to execute the function.
   */
  @SubscribeMessage('visualizeChat')
  async onVisualizeMessage(@MessageBody() body: IVisualizeChatBody) {
    try {
      // Verifying access token
      const { sub: userId } = this.jwtService.verify(body.access_token, {
        secret: env.JWT_SECRET,
      });

      // Defining messages as visualized
      await this.visualizeMessagesService.execute({
        fromUserId: body.fromUserId,
        userId,
      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Event subscription used to define that the user is typing. So that the user
   * can know when the friend is typing. It starts an interval to keep verifying
   * if the user is still typing or stopped typing.
   * @param body The data needed to execute the function
   */
  @SubscribeMessage('typing')
  async onChatTyping(@MessageBody() body: ITypingBody) {
    try {
      // Verifying access token
      const { sub: userId } = this.jwtService.verify(body.access_token, {
        secret: env.JWT_SECRET,
      });

      // If the userId is not registered yet in intervals dictionary,
      // we inicialize a new object with this key.
      if (!this.usersIntervals[userId]) {
        this.usersIntervals[userId] = {
          interval: undefined,
          lastTypingTime: undefined,
        };
      }

      // If the lastTypingTime exists, we redefine it as current date
      if (this.usersIntervals[userId].lastTypingTime) {
        this.usersIntervals[userId].lastTypingTime = new Date();
      }

      // Emiting event for user that will receive the message to warn that
      // his/her friend is typing
      const receiverSocketId = this.usersSocketsIds[body.toUserId];
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('friendIsTyping', {
          fromUserId: userId,
        });
      }

      // If there is no lastTypingTime, we start an interval to keep verifying
      // if user is still typing. The lastTypingTime will keep being updated
      // each time the user types something.
      if (!this.usersIntervals[userId].lastTypingTime) {
        this.usersIntervals[userId].lastTypingTime = new Date();
        const interval = setInterval(() => {
          // When the user stops typing, the interval will stop after the
          // difference of lastDateTime and currentDate is above 2.
          if (
            moment(new Date()).diff(
              moment(this.usersIntervals[userId].lastTypingTime),
              'seconds',
            ) > 2
          ) {
            // After the user stopped typing, the interval emits the event
            // "friendStoppedTyping" to warn his/her friend that he/she
            // stopped typing.
            const receiverSocketId = this.usersSocketsIds[body.toUserId];
            if (receiverSocketId) {
              this.server.to(receiverSocketId).emit('friendStoppedTyping', {
                fromUserId: userId,
              });
            }
            // Clearing the interval
            clearInterval(interval);
            // Reseting the userIntervals control info
            this.usersIntervals[userId].lastTypingTime = undefined;
            this.usersIntervals[userId].interval = undefined;
          }
        }, 1000);

        // Saving the interval id in state
        this.usersIntervals[userId].interval = interval;
      }
    } catch (e) {
      console.log(e);
    }
  }
}
