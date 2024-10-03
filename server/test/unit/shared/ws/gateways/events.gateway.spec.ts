import { CreateMessageService } from '@modules/chat/services/create-message.service';
import { VisualizeMessagesService } from '@modules/chat/services/visualize-messages.service';
import { AddFriendService } from '@modules/friendship/services/add-friend.service';
import { GetFriendsService } from '@modules/friendship/services/get-friends.service';
import { User } from '@modules/user/infra/db/entities/user';
import { GetUserService } from '@modules/user/services/get-user.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from '@shared/infra/ws/gateways/events.gateway';
import { env } from '@shared/resources/env';
import { fakeUserObject } from '@test/unit/mock/fake-user-object.mock';
import { Socket } from 'socket.io';

describe('EventsGateway', () => {
  let createMessageService: CreateMessageService;
  let getFriendsService: GetFriendsService;
  let visualizeMessagesService: VisualizeMessagesService;
  let getUserService: GetUserService;
  let addFriendService: AddFriendService;
  let jwtService: JwtService;
  let sut: EventsGateway;

  const validUser = new User(fakeUserObject, fakeUserObject.id);
  const validFriend = new User(fakeUserObject, 'fake-friend-id');

  let socketClient: Socket;
  const serverToEmitFunc = jest.fn();

  beforeEach(async () => {
    const fakeJwtService = {
      sign: jest.fn().mockReturnValue('fake-token'),
      verify: jest.fn().mockReturnValue({ sub: validUser.id }),
    };

    socketClient = {
      id: 'fake-socket-id',
      emit: jest.fn(),
      handshake: {
        query: {
          access_token: 'fake-token',
        },
      },
    } as any as Socket;

    // Create testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateMessageService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: GetFriendsService,
          useValue: {
            execute: jest.fn().mockResolvedValue({ data: [validUser] }),
          },
        },
        {
          provide: VisualizeMessagesService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: GetUserService,
          useValue: {
            execute: jest.fn().mockResolvedValue({ user: validFriend }),
          },
        },
        {
          provide: AddFriendService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: JwtService,
          useValue: fakeJwtService,
        },
        EventsGateway,
      ],
    }).compile();
    // Assign services
    createMessageService = moduleFixture.get(CreateMessageService);
    getFriendsService = moduleFixture.get(GetFriendsService);
    visualizeMessagesService = moduleFixture.get(VisualizeMessagesService);
    getUserService = moduleFixture.get(GetUserService);
    addFriendService = moduleFixture.get(AddFriendService);
    jwtService = moduleFixture.get(JwtService);
    // Assign sut
    sut = moduleFixture.get(EventsGateway);

    sut['server'] = {
      on: jest.fn(),
      to: () => ({ emit: serverToEmitFunc }),
    } as any;
    jest
      .spyOn(sut['server'], 'on')
      .mockImplementation((key: string, listener: any): any => {
        listener(socketClient);
      });

    sut.onModuleInit();
  });

  describe('onNewMessage', () => {
    const body = {
      toUserId: validFriend.id,
      content: 'fake-content',
      access_token: 'fake-access-token',
    };

    it('should be able to handle new message', async () => {
      const promise = sut.onNewMessage(body, socketClient);
      expect(promise).resolves.toEqual(undefined);
    });

    it('should be able to call JwtService::verify with right parameters', async () => {
      const spy = jest.spyOn(jwtService, 'verify');
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith(body.access_token, { secret: env.JWT_SECRET });
    });

    it('should be able to call GetUserService::execute with right parameters', async () => {
      const spy = jest.spyOn(getUserService, 'execute');
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith({ userId: validUser.id });
      expect(spy).toBeCalledTimes(1);
    });

    it('should be able to call CreateMessageService::execute with right parameters', async () => {
      const spy = jest.spyOn(createMessageService, 'execute');
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith({
        fromUserId: validUser.id,
        toUserId: body.toUserId,
        content: body.content,
        role: 'user',
      });
      expect(spy).toBeCalledTimes(1);

      // Consider user is assistant
      jest.spyOn(getUserService, 'execute').mockResolvedValueOnce({
        user: new User({ ...validUser, isAssistant: true }, validUser.id),
      });
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith({
        fromUserId: validUser.id,
        toUserId: body.toUserId,
        content: body.content,
        role: 'assistant',
      });
    });

    it('should be able to emit handleCreateMessage event to client sender', async () => {
      const spy = jest.spyOn(socketClient, 'emit');
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith('handleCreatedMessage', {
        fromUserId: validUser.id,
        toUserId: body.toUserId,
        content: body.content,
        role: 'user',
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should be able to call GetFriendsService::execute with right parameters', async () => {
      const spy = jest.spyOn(getFriendsService, 'execute');
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith({ userId: body.toUserId });
      expect(spy).toBeCalledTimes(1);
    });

    it('should be able to call GetUserService::execute with right parameters', async () => {
      const spy = jest.spyOn(getUserService, 'execute');
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith({ userId: validUser.id });
      expect(spy).toBeCalledTimes(1);
    });

    it('should be able to call AddFriendService::execute with right parameters', async () => {
      // Return a list of empty friends of user
      jest
        .spyOn(getFriendsService, 'execute')
        .mockResolvedValueOnce({ data: [] });
      // Get addFriendService spy
      const spy = jest.spyOn(addFriendService, 'execute');
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith({
        userId: body.toUserId,
        friendEmail: validUser.email,
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should be able to emit handleCreateMessage to receiver client', async () => {
      // Add friend socket state data
      sut['clientsStateData'][validFriend.id] = {
        socketId: 'fake-friend-socket-id',
        interval: undefined,
        lastTypingTime: undefined,
      };

      // Get spy
      const spy = jest.spyOn(sut['server'], 'to');
      const spyEvent = serverToEmitFunc;
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith('fake-friend-socket-id');
      expect(spyEvent).toBeCalledWith('handleCreatedMessage', {
        fromUserId: validUser.id,
        toUserId: body.toUserId,
        content: body.content,
        role: 'user',
      });
      expect(spy).toBeCalledTimes(2);

      sut['clientsStateData'][validFriend.id] = undefined;
    });

    it('should be able to emit friendStoppedTyping to receiver client', async () => {
      // Add friend socket state data
      sut['clientsStateData'][validFriend.id] = {
        socketId: 'fake-friend-socket-id',
        interval: undefined,
        lastTypingTime: undefined,
      };

      // Get spy
      const spy = jest.spyOn(sut['server'], 'to');
      const spyEvent = serverToEmitFunc;
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith('fake-friend-socket-id');
      expect(spyEvent).toBeCalledWith('friendStoppedTyping', {
        fromUserId: validUser.id,
      });
      expect(spy).toBeCalledTimes(2);

      sut['clientsStateData'][validFriend.id] = undefined;
    });

    it('should be able to call clearInterval with right parameters', async () => {
      const spy = jest.spyOn(global, 'clearInterval');
      await sut.onNewMessage(body, socketClient);
      expect(spy).toBeCalledWith(
        sut['clientsStateData'][validUser.id].interval,
      );
      expect(sut['clientsStateData'][validUser.id].interval).toEqual(undefined);
      expect(sut['clientsStateData'][validUser.id].lastTypingTime).toEqual(
        undefined,
      );
      expect(spy).toBeCalledTimes(1);
    });
  });
});
