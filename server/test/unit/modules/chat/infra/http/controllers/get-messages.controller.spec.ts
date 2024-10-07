import { GetMessagesController } from '@modules/chat/infra/http/controllers/get-messages.controller';
import { GetMessagesService } from '@modules/chat/services/get-messages.service';
import { Test } from '@nestjs/testing';
import { fakeFriendshipObject } from '@test/unit/mock/fake-friendship-object.mock';
import { fakeMessageObject } from '@test/unit/mock/fake-message-object.mock';
import { Request, Response } from 'express';

describe('GetMessagesController', () => {
  let getMessagesService: GetMessagesService;
  let sut: GetMessagesController;

  const expectedMessagesResponse = {
    data: [
      {
        fromUserId: fakeMessageObject.fromUserId,
        toUserId: fakeMessageObject.toUserId,
        content: fakeMessageObject.content,
      },
    ],
  };

  beforeEach(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        {
          provide: GetMessagesService,
          useValue: {
            execute: jest.fn().mockResolvedValue(expectedMessagesResponse),
          },
        },
      ],
      controllers: [GetMessagesController],
    }).compile();
    // Get service
    getMessagesService = moduleFixture.get(GetMessagesService);
    // Get controller
    sut = moduleFixture.get(GetMessagesController);
  });

  describe('execute', () => {
    // Request
    const fakeRequest = {
      params: {
        fromUserId: fakeMessageObject.fromUserId,
      },
      user: {
        userId: fakeMessageObject.toUserId,
      },
    } as any as Request & { user: { userId: string; sub: string } };

    // Response
    const fakeResponseJsonFunc = jest.fn();
    const fakeResponse = {
      status: jest.fn().mockReturnValue({ json: fakeResponseJsonFunc }),
    } as any as Response;

    it('should be able to get messages', async () => {
      const spy = fakeResponseJsonFunc;
      await sut.handle(fakeRequest, fakeResponse);
      expect(spy).toBeCalledWith(expectedMessagesResponse);
    });

    it('should call GetMessagesService::execute with right parameters', async () => {
      const spy = jest.spyOn(getMessagesService, 'execute');
      await sut.handle(fakeRequest, fakeResponse);
      expect(spy).toBeCalledWith({
        fromUserId: fakeRequest.params.fromUserId,
        toUserId: fakeRequest.user.userId,
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if GetMessagesService::execute throws unknown error', async () => {
      jest
        .spyOn(getMessagesService, 'execute')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.handle(fakeRequest, fakeResponse);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
