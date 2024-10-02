import { Friendship } from '@modules/friendship/infra/db/entities/friendship';
import { FriendshipsRepository } from '@modules/friendship/repositories/friendships.repository';
import { GetFriendsService } from '@modules/friendship/services/get-friends.service';
import { Test } from '@nestjs/testing';
import { fakeFriendshipObject } from '@test/unit/mock/fake-friendship-object.mock';

describe('GetFriendsService', () => {
  let friendshipsRepository: FriendshipsRepository;
  let sut: GetFriendsService;

  const expectedFriendship = new Friendship(
    fakeFriendshipObject,
    fakeFriendshipObject.id,
  );

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const fakeFriendshipsRepository = {
      findAllOfUser: jest.fn().mockResolvedValue([expectedFriendship]),
    };

    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        { provide: FriendshipsRepository, useValue: fakeFriendshipsRepository },
        GetFriendsService,
      ],
    }).compile();
    // Get repository
    friendshipsRepository = moduleFixture.get(FriendshipsRepository);
    // Get service
    sut = moduleFixture.get(GetFriendsService);
  });

  describe('execute', () => {
    const params = {
      userId: 'fake-user-id',
    };

    const fakeFriendsReturn = {
      id: fakeFriendshipObject.friend.id,
      email: fakeFriendshipObject.friend.email,
      name: fakeFriendshipObject.friend.name,
      isAssistant: fakeFriendshipObject.friend.isAssistant,
    };

    it('should be able to get user friendships', async () => {
      const result = await sut.execute(params);
      expect(result).toEqual({ data: [fakeFriendsReturn] });
    });

    it('should call FriendshipsRepository::findAllOfUser with right parameters', async () => {
      const spy = jest.spyOn(friendshipsRepository, 'findAllOfUser');
      await sut.execute(params);
      expect(spy).toBeCalledWith(params.userId);
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if FriendshipsRepository::findAllOfUser throws unknown error', async () => {
      jest
        .spyOn(friendshipsRepository, 'findAllOfUser')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
