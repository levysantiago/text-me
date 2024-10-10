import { GetAmountOfUnseenMessagesController } from '@modules/chat/infra/http/controllers/get-amount-of-unseen-messages.controller';
import { GetFriendsMessagesResumeService } from '@modules/chat/services/get-friends-messages-resume.service';
import { Test } from '@nestjs/testing';
import { fakeFriendshipObject } from '@test/unit/mock/fake-friendship-object.mock';
import { fakeMessageObject } from '@test/unit/mock/fake-message-object.mock';
import { Request, Response } from 'express';

describe('GetAmountOfUnseenMessagesController', () => {
  let getFriendsMessagesResumeService: GetFriendsMessagesResumeService;
  let sut: GetAmountOfUnseenMessagesController;

  const expectedMessagesResumeResponse = {
    data: {
      [fakeFriendshipObject.friendId]: {
        lastMessage: fakeMessageObject.content,
        unseenMessages: 1,
      },
    },
  };

  beforeEach(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        {
          provide: GetFriendsMessagesResumeService,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue(expectedMessagesResumeResponse),
          },
        },
      ],
      controllers: [GetAmountOfUnseenMessagesController],
    }).compile();
    // Get service
    getFriendsMessagesResumeService = moduleFixture.get(
      GetFriendsMessagesResumeService,
    );
    // Get controller
    sut = moduleFixture.get(GetAmountOfUnseenMessagesController);
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

    it('should be able to get messages resume', async () => {
      const spy = fakeResponseJsonFunc;
      await sut.handle(fakeRequest, fakeResponse);
      expect(spy).toBeCalledWith(expectedMessagesResumeResponse);
    });

    it('should call GetFriendsMessagesResumeService::execute with right parameters', async () => {
      const spy = jest.spyOn(getFriendsMessagesResumeService, 'execute');
      await sut.handle(fakeRequest, fakeResponse);
      expect(spy).toBeCalledWith({
        toUserId: fakeRequest.user.userId,
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if GetFriendsMessagesResumeService::execute throws unknown error', async () => {
      jest
        .spyOn(getFriendsMessagesResumeService, 'execute')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.handle(fakeRequest, fakeResponse);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
