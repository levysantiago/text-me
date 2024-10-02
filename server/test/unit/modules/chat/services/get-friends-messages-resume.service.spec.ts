import { MessagesNotFoundError } from '@modules/chat/errors/messages-not-found.error';
import { Message } from '@modules/chat/infra/db/entities/message';
import { MessagesRepository } from '@modules/chat/repositories/messages.repository';
import { GetFriendsMessagesResumeService } from '@modules/chat/services/get-friends-messages-resume.service';
import { FriendNotFoundError } from '@modules/friendship/errors/friend-not-found.error';
import { Friendship } from '@modules/friendship/infra/db/entities/friendship';
import { FriendshipsRepository } from '@modules/friendship/repositories/friendships.repository';
import { Test } from '@nestjs/testing';
import { fakeFriendshipObject } from '@test/unit/mock/fake-friendship-object.mock';
import { fakeMessageObject } from '@test/unit/mock/fake-message-object.mock';

describe('GetFriendsMessagesResumeService', () => {
  let friendshipsRepository: FriendshipsRepository;
  let messagesRepository: MessagesRepository;
  let sut: GetFriendsMessagesResumeService;

  const expectedMessage = new Message(
    { ...fakeMessageObject, fromUserId: fakeFriendshipObject.friendId },
    fakeMessageObject.id,
  );
  const expectedFriendship = new Friendship(
    fakeFriendshipObject,
    fakeFriendshipObject.id,
  );

  beforeEach(async () => {
    const fakeMessageRepository = {
      findAllOfUser: jest.fn().mockResolvedValue([expectedMessage]),
    };

    const fakeFriendshipsRepository = {
      findAllOfUser: jest.fn().mockResolvedValue([expectedFriendship]),
    };

    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        { provide: MessagesRepository, useValue: fakeMessageRepository },
        { provide: FriendshipsRepository, useValue: fakeFriendshipsRepository },
        GetFriendsMessagesResumeService,
      ],
    }).compile();
    // Get repository
    messagesRepository = moduleFixture.get(MessagesRepository);
    // Get repository
    friendshipsRepository = moduleFixture.get(FriendshipsRepository);
    // Get service
    sut = moduleFixture.get(GetFriendsMessagesResumeService);
  });

  describe('execute', () => {
    const params = {
      toUserId: 'fake-to-user-id',
    };

    it('should be able to get friends messages resume', async () => {
      const result = await sut.execute(params);
      expect(result).toEqual({
        data: {
          [fakeFriendshipObject.friendId]: {
            lastMessage: fakeMessageObject.content,
            unseenMessages: 1,
          },
        },
      });
    });

    it('should call MessagesRepository::findAllOfUser with right parameters', async () => {
      const spy = jest.spyOn(messagesRepository, 'findAllOfUser');
      await sut.execute(params);
      expect(spy).toBeCalledWith(params.toUserId);
      expect(spy).toBeCalledTimes(1);
    });

    it('should call FriendshipsRepository::findAllOfUser with right parameters', async () => {
      const spy = jest.spyOn(friendshipsRepository, 'findAllOfUser');
      await sut.execute(params);
      expect(spy).toBeCalledWith(params.toUserId);
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if MessagesRepository::findAllOfUser throws unknown error', async () => {
      jest
        .spyOn(messagesRepository, 'findAllOfUser')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new MessagesNotFoundError());
    });
  });
});
