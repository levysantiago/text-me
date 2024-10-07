import { Message } from '@modules/chat/infra/db/entities/message';
import { MessagesRepository } from '@modules/chat/repositories/messages.repository';
import { CreateMessageService } from '@modules/chat/services/create-message.service';
import { FriendNotFoundError } from '@modules/friendship/errors/friend-not-found.error';
import { User } from '@modules/user/infra/db/entities/user';
import { UsersRepository } from '@modules/user/repositories/users-repository';
import { Test } from '@nestjs/testing';
import { IRole } from '@shared/resources/types/irole';
import { fakeMessageObject } from '@test/unit/mock/fake-message-object.mock';
import { fakeUserObject } from '@test/unit/mock/fake-user-object.mock';

describe('CreateMessageService', () => {
  let usersRepository: UsersRepository;
  let messagesRepository: MessagesRepository;
  let sut: CreateMessageService;

  const expectedMessage = new Message(fakeMessageObject, fakeMessageObject.id);
  const expectedUser = new User(fakeUserObject, fakeUserObject.id);

  beforeEach(async () => {
    const fakeMessageRepository = {
      create: jest.fn().mockResolvedValue(expectedMessage),
    };

    const fakeUsersRepository = {
      find: jest.fn().mockResolvedValue(expectedUser),
    };

    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        { provide: MessagesRepository, useValue: fakeMessageRepository },
        { provide: UsersRepository, useValue: fakeUsersRepository },
        CreateMessageService,
      ],
    }).compile();
    // Get repository
    messagesRepository = moduleFixture.get(MessagesRepository);
    // Get repository
    usersRepository = moduleFixture.get(UsersRepository);
    // Get service
    sut = moduleFixture.get(CreateMessageService);
  });

  describe('execute', () => {
    const params = {
      fromUserId: 'fake-from-user-id',
      toUserId: 'fake-to-user-id',
      content: 'fake-content',
      role: 'user' as IRole,
    };

    it('should be able to create message', async () => {
      const promise = sut.execute(params);
      expect(promise).resolves.toEqual(undefined);
    });

    it('should call MessagesRepository::create with right parameters', async () => {
      const spy = jest.spyOn(messagesRepository, 'create');
      await sut.execute(params);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          content: expectedMessage.content,
          conversation: expectedMessage.conversation,
          visualized: expectedMessage.visualized,
          role: expectedMessage.role,
          toUserId: expectedMessage.toUserId,
          fromUserId: expectedMessage.fromUserId,
        }),
      );
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if MessagesRepository::create throws unknown error', async () => {
      jest
        .spyOn(messagesRepository, 'create')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });

    it('should throw FriendNotFoundError if UsersRepository::find returns an invalid user', async () => {
      jest.spyOn(usersRepository, 'find').mockResolvedValueOnce(null);
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new FriendNotFoundError());
    });
  });
});
