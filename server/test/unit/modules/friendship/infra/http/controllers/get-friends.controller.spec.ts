import { GetFriendsController } from '@modules/friendship/infra/http/controllers/get-friends.controller';
import { GetFriendsService } from '@modules/friendship/services/get-friends.service';
import { User } from '@modules/user/infra/db/entities/user';
import { Test } from '@nestjs/testing';
import { fakeFriendshipObject } from '@test/unit/mock/fake-friendship-object.mock';
import { Request, Response } from 'express';

describe('GetFriendsController', () => {
  let getFiendsService: GetFriendsService;
  let sut: GetFriendsController;

  const expectedFriend = new User(
    fakeFriendshipObject.friend,
    fakeFriendshipObject.friend.id,
  );

  beforeEach(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        {
          provide: GetFriendsService,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue({ data: [expectedFriend.toHTTP()] }),
          },
        },
      ],
      controllers: [GetFriendsController],
    }).compile();
    // Get service
    getFiendsService = moduleFixture.get(GetFriendsService);
    // Get controller
    sut = moduleFixture.get(GetFriendsController);
  });

  describe('execute', () => {
    // Request
    const fakeRequest = {
      user: {
        userId: fakeFriendshipObject.friend.id,
      },
    } as any as Request & { user: { userId: string; sub: string } };

    // Response
    const fakeResponseJsonFunc = jest.fn();
    const fakeResponse = {
      status: jest.fn().mockReturnValue({ json: fakeResponseJsonFunc }),
    } as any as Response;

    it('should be able to get user friends', async () => {
      const spy = fakeResponseJsonFunc;
      await sut.handle(fakeRequest, fakeResponse);
      expect(spy).toBeCalledWith({ data: [expectedFriend.toHTTP()] });
    });

    it('should call GetFriendsService::execute with right parameters', async () => {
      const spy = jest.spyOn(getFiendsService, 'execute');
      await sut.handle(fakeRequest, fakeResponse);
      expect(spy).toBeCalledWith({
        userId: fakeRequest.user.userId,
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if GetFriendsService::execute throws unknown error', async () => {
      jest
        .spyOn(getFiendsService, 'execute')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.handle(fakeRequest, fakeResponse);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
