import { FriendNotFoundError } from '@modules/friendship/errors/friend-not-found.error';
import { FriendshipsRepository } from '@modules/friendship/repositories/friendships.repository';
import { AddFriendService } from '@modules/friendship/services/add-friend.service';
import { User } from '@modules/user/infra/db/entities/user';
import { UsersRepository } from '@modules/user/repositories/users-repository';
import { Test } from '@nestjs/testing';
import { fakeUserObject } from '@test/unit/mock/fake-user-object.mock';

describe('AddFriendService', () => {
  let usersRepository: UsersRepository;
  let friendshipsRepository: FriendshipsRepository;
  let sut: AddFriendService;

  const expectedFriendUser = new User(fakeUserObject, fakeUserObject.id);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const fakeUsersRepository = {
      findByEmail: jest.fn().mockResolvedValue(expectedFriendUser),
    };

    const fakeFriendshipsRepository = {
      create: jest.fn().mockResolvedValue(undefined),
    };

    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        { provide: UsersRepository, useValue: fakeUsersRepository },
        { provide: FriendshipsRepository, useValue: fakeFriendshipsRepository },
        AddFriendService,
      ],
    }).compile();
    // Get repository
    usersRepository = moduleFixture.get(UsersRepository);
    // Get repository
    friendshipsRepository = moduleFixture.get(FriendshipsRepository);
    // Get service
    sut = moduleFixture.get(AddFriendService);
  });

  describe('execute', () => {
    const params = {
      userId: 'fake-user-id',
      friendEmail: 'fake-friend-email',
    };

    it('should be able to create friendship', async () => {
      const promise = sut.execute(params);
      expect(promise).resolves.toEqual(undefined);
    });

    it('should call UsersRepository::findByEmail with right parameters', async () => {
      const spy = jest.spyOn(usersRepository, 'findByEmail');
      await sut.execute(params);
      expect(spy).toBeCalledWith(params.friendEmail);
      expect(spy).toBeCalledTimes(1);
    });

    it('should call FriendshipsRepository::create with right parameters', async () => {
      const spy = jest.spyOn(friendshipsRepository, 'create');
      await sut.execute(params);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          userId: params.userId,
          friendId: expectedFriendUser.id,
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if FriendshipsRepository::create throws unknown error', async () => {
      jest
        .spyOn(friendshipsRepository, 'create')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });

    it('should throw FriendNotFoundError if UsersRepository::findByEmail returns an invalid user', async () => {
      jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(null);
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new FriendNotFoundError());
    });
  });
});
