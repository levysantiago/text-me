import { User } from '@modules/user/infra/db/entities/user';
import { UpdateUserController } from '@modules/user/infra/http/controllers/update-user.controller';
import { UpdateUserService } from '@modules/user/services/update-user.service';
import { Test } from '@nestjs/testing';
import { fakeUserObject } from '@test/unit/mock/fake-user-object.mock';
import { Response } from 'express';

describe('UpdateUserController', () => {
  let updateUserService: UpdateUserService;
  let sut: UpdateUserController;

  const expectedUser = new User(fakeUserObject, fakeUserObject.id);
  const fakeResponseJsonFunc = jest.fn();
  const fakeResponse = {
    status: jest.fn().mockReturnValue({ json: fakeResponseJsonFunc }),
  } as any as Response;

  beforeEach(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateUserService,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue({ user: expectedUser.toHTTP() }),
          },
        },
      ],
      controllers: [UpdateUserController],
    }).compile();
    // Get service
    updateUserService = moduleFixture.get(UpdateUserService);
    // Get controller
    sut = moduleFixture.get(UpdateUserController);
  });

  describe('execute', () => {
    const body = {
      name: 'bob',
      password: '12345678',
    };

    const fakeRequest = {
      user: { userId: 'fake-id' },
    };

    it('should be able to create user', async () => {
      const spy = fakeResponseJsonFunc;
      await sut.handle(body, fakeRequest, fakeResponse);
      expect(spy).toBeCalledWith({ user: expectedUser.toHTTP() });
    });

    it('should call UpdateUserService::execute with right parameters', async () => {
      const spy = jest.spyOn(updateUserService, 'execute');
      await sut.handle(body, fakeRequest, fakeResponse);
      expect(spy).toBeCalledWith({ ...body, id: fakeRequest.user.userId });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if UpdateUserService::execute throws unknown error', async () => {
      jest
        .spyOn(updateUserService, 'execute')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.handle(body, fakeRequest, fakeResponse);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
