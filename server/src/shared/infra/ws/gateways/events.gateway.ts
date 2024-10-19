import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as moment from 'moment';
import { Server, Socket } from 'socket.io';
import { env } from '@shared/resources/env';
import { CreateMessageService } from '@modules/chat/services/create-message.service';
import { GetFriendsService } from '@modules/friendship/services/get-friends.service';
import { VisualizeMessagesService } from '@modules/chat/services/visualize-messages.service';
import { GetUserService } from '@modules/user/services/get-user.service';
import { AddFriendService } from '@modules/friendship/services/add-friend.service';
import { WsClientsHelper } from './helpers/ws-clients.helper';
import { UnauthorizedError } from '@shared/infra/errors/unauthorized.error';
import { ILocale } from '@shared/resources/types/ilocale';
import { AppError } from '@shared/resources/errors/app.error';
import { InternalServerError } from '@shared/infra/errors/internal-server.error';

interface INewMessageBody {
  toUserId: string;
  content: string;
}

interface IVisualizeChatBody {
  fromUserId: string;
}

interface ITypingBody {
  toUserId: string;
}

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private createMessageService: CreateMessageService,
    private getFriendsService: GetFriendsService,
    private visualizeMessagesService: VisualizeMessagesService,
    private getUserService: GetUserService,
    private addFriendService: AddFriendService,
    private jwtService: JwtService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    let defaultLocale: ILocale = 'en';
    try {
      // Capture access token
      const accessTokenHeader = client.handshake.headers[
        'authorization'
      ] as string;
      const accessToken = accessTokenHeader
        ? accessTokenHeader.replace('Bearer ', '')
        : '';

      // Capture locale preference
      const locale = client.handshake.headers['accept-language'] as string;

      // Define locale
      if (locale === 'en' || locale === 'pt') {
        defaultLocale = locale;
      }

      // Validate access token
      const { sub: userId } = this.jwtService.verify(accessToken, {
        secret: env.JWT_SECRET,
      });

      // Save client data to cache
      WsClientsHelper.save({
        clientId: client.id,
        locale: defaultLocale,
        userId: userId,
        token: accessToken,
      });
    } catch (e) {
      console.log(e);

      const appError = new UnauthorizedError();
      client.emit('connectionError', appError.toJson('/', defaultLocale));

      client.disconnect();
    }
  }

  handleDisconnect(client: any) {
    WsClientsHelper.delete(client.id);
  }

  /**
   * Event subscription that handles a new message creation.
   * After creating the messages, emits the "handleCreatedMessage"
   * event to update the client messages and "friendStoppedTyping" event
   * to warn the user that his/her friend stopped typing.
   * @param body The data needed to create the message
   * @param fromClient Who sent the message
   */
  @SubscribeMessage('newMessage')
  async onNewMessage(
    @MessageBody() body: INewMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    const clientData = WsClientsHelper.findByClientId(client.id);
    try {
      // Verifying access token
      const { sub: fromUserId } = this.jwtService.verify(clientData.token, {
        secret: env.JWT_SECRET,
      });

      // Find user
      const { user } = await this.getUserService.execute({
        userId: fromUserId,
      });

      // Define role
      const role = !user.isAssistant ? 'user' : 'assistant';

      // Creating message
      await this.createMessageService.execute({
        fromUserId,
        toUserId: body.toUserId,
        content: body.content,
        role,
      });

      // Emit event for user that sent message
      client.emit('handleCreatedMessage', {
        fromUserId,
        toUserId: body.toUserId,
        content: body.content,
        role,
      });

      //Getting the friends of user receiver to verify if the message sender
      // is his/her friend
      const friendsOfReceiver = await this.getFriendsService.execute({
        userId: body.toUserId,
      });
      // Verifying if users are friends
      const areTheyFriends = friendsOfReceiver.data.filter((friend) => {
        return friend.id === fromUserId;
      })[0];
      if (!areTheyFriends) {
        // If they are not friends, we create a friendship between them
        // Creating friendship
        await this.addFriendService.execute({
          userId: body.toUserId,
          friendEmail: user.email,
        });
      }

      // Getting the user receiver socket id
      const receiverClientData = WsClientsHelper.findByUserId(body.toUserId);
      if (receiverClientData) {
        const receiverSocketId = receiverClientData.clientId;
        // Emit event for user that received message
        this.server.to(receiverSocketId).emit('handleCreatedMessage', {
          fromUserId,
          toUserId: body.toUserId,
          content: body.content,
        });
        // Emitting event to user receiver that his friend stopped typing
        this.server.to(receiverSocketId).emit('friendStoppedTyping', {
          fromUserId,
        });
      }
      // Clearing typing verifier interval
      clearInterval(clientData.interval);
      // Resetting interval and lastTypingTime
      WsClientsHelper.update(client.id, {
        interval: null,
        lastTypingTime: null,
      });
    } catch (err) {
      if (err instanceof AppError) {
        client.emit(
          'newMessageError',
          err.toJson('/', clientData.locale || 'en'),
        );
      }

      console.log(err);

      const defaultError = new InternalServerError();
      client.emit(
        'newMessageError',
        defaultError.toJson('/', clientData.locale || 'en'),
      );
    }
  }

  /**
   * Event subscription used to define all users messages received as
   * visualized. This must be emitted when the user opens the chat page.
   * @param body The data needed to execute the function.
   */
  @SubscribeMessage('visualizeChat')
  async onVisualizeMessage(
    @MessageBody() body: IVisualizeChatBody,
    @ConnectedSocket() client,
  ) {
    const clientData = WsClientsHelper.findByClientId(client.id);
    try {
      // Verifying access token
      const { sub: userId } = this.jwtService.verify(clientData.token, {
        secret: env.JWT_SECRET,
      });

      // Defining messages as visualized
      await this.visualizeMessagesService.execute({
        fromUserId: body.fromUserId,
        userId,
      });
    } catch (err) {
      if (err instanceof AppError) {
        client.emit(
          'visualizeChatError',
          err.toJson('/', clientData.locale || 'en'),
        );
      }

      console.log(err);

      const defaultError = new InternalServerError();
      client.emit(
        'visualizeChatError',
        defaultError.toJson('/', clientData.locale || 'en'),
      );
    }
  }

  /**
   * Event subscription used to define that the user is typing. So that the user
   * can know when the friend is typing. It starts an interval to keep verifying
   * if the user is still typing or stopped typing.
   * @param body The data needed to execute the function
   */
  @SubscribeMessage('typing')
  async onChatTyping(
    @MessageBody() body: ITypingBody,
    @ConnectedSocket() client,
  ) {
    const clientData = WsClientsHelper.findByClientId(client.id);
    try {
      // Verifying access token
      const { sub: userId } = this.jwtService.verify(clientData.token, {
        secret: env.JWT_SECRET,
      });

      // If the lastTypingTime exists, we redefine it as current date
      if (clientData.lastTypingTime) {
        WsClientsHelper.update(client.id, {
          lastTypingTime: new Date(),
        });
      }

      // Emitting event for user that will receive the message to warn that
      // his/her friend is typing
      const receiverClientData = WsClientsHelper.findByUserId(body.toUserId);
      if (receiverClientData) {
        const receiverSocketId = receiverClientData.clientId;
        this.server.to(receiverSocketId).emit('friendIsTyping', {
          fromUserId: userId,
        });
      }

      // If there is no lastTypingTime, we start an interval to keep verifying
      // if user is still typing. The lastTypingTime will keep being updated
      // each time the user types something.
      if (!clientData.lastTypingTime) {
        WsClientsHelper.update(client.id, {
          lastTypingTime: new Date(),
        });
        const interval = setInterval(() => {
          // Transform typing time to Moment instance
          const typingTimeMoment = moment(clientData.lastTypingTime);

          // Get current date as moment instance
          const currentDateMoment = moment(new Date());

          // Two milliseconds
          const twoMilliseconds = 2;

          // Definition if user is still typing
          const didUserStoppedTyping =
            currentDateMoment.diff(typingTimeMoment) > twoMilliseconds;

          // When the user stops typing, the interval will stop after the
          // difference of lastDateTime and currentDate is above 2 milliseconds.
          if (didUserStoppedTyping) {
            // After the user stopped typing, the interval emits the event
            // "friendStoppedTyping" to warn his/her friend that he/she
            // stopped typing.

            const receiverClientData = WsClientsHelper.findByUserId(
              body.toUserId,
            );
            if (receiverClientData) {
              const receiverSocketId = receiverClientData.clientId;
              this.server.to(receiverSocketId).emit('friendStoppedTyping', {
                fromUserId: userId,
              });
            }
            // Clearing the interval
            clearInterval(interval);
            // Resetting the userIntervals control info
            WsClientsHelper.update(client.id, {
              interval: null,
              lastTypingTime: null,
            });
          }
        }, 1000);

        // Saving the interval id in state
        WsClientsHelper.update(client.id, {
          interval,
        });
      }
    } catch (err) {
      if (err instanceof AppError) {
        client.emit('typingError', err.toJson('/', clientData.locale || 'en'));
      }

      console.log(err);

      const defaultError = new InternalServerError();
      client.emit(
        'typingError',
        defaultError.toJson('/', clientData.locale || 'en'),
      );
    }
  }
}
