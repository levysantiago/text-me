import { AddFriendController } from '@modules/friendship/infra/http/controllers/add-friend.controller';
import { AddFriendService } from '@modules/friendship/services/add-friend.service';
import { User } from '@modules/user/infra/db/entities/user';
import { Test } from '@nestjs/testing';
import { fakeFriendshipObject } from '@test/unit/mock/fake-friendship-object.mock';
import { Request, Response } from 'express';

describe('AddFriendController', () => {
  let addFiendsService: AddFriendService;
  let sut: AddFriendController;

  const expectedFriend = new User(
    fakeFriendshipObject.friend,
    fakeFriendshipObject.friend.id,
  );

  beforeEach(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        {
          provide: AddFriendService,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue({ data: [expectedFriend.toHTTP()] }),
          },
        },
      ],
      controllers: [AddFriendController],
    }).compile();
    // Get service
    addFiendsService = moduleFixture.get(AddFriendService);
    // Get controller
    sut = moduleFixture.get(AddFriendController);
  });

  describe('execute', () => {
    // Request
    const fakeRequest = {
      user: {
        userId: fakeFriendshipObject.friend.id,
      },
    } as any as Request & { user: { userId: string; sub: string } };

    // Response
    const fakeResponseSendFunc = jest.fn();
    const fakeResponse = {
      status: jest.fn().mockReturnValue({ send: fakeResponseSendFunc }),
    } as any as Response;

    const body = {
      friendEmail: 'friend-email',
    };

    it('should be able to add friend', async () => {
      const spy = fakeResponseSendFunc;
      await sut.handle(body, fakeRequest, fakeResponse);
      expect(spy).toBeCalledWith();
    });

    it('should call AddFriendsService::execute with right parameters', async () => {
      const spy = jest.spyOn(addFiendsService, 'execute');
      await sut.handle(body, fakeRequest, fakeResponse);
      expect(spy).toBeCalledWith({
        friendEmail: body.friendEmail,
        userId: fakeRequest.user.userId,
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if AddFriendsService::execute throws unknown error', async () => {
      jest
        .spyOn(addFiendsService, 'execute')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.handle(body, fakeRequest, fakeResponse);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
