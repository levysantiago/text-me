import { User } from '@modules/user/infra/db/entities/user';
import { CreateUserController } from '@modules/user/infra/http/controllers/create-user.controller';
import { CreateUserService } from '@modules/user/services/create-user.service';
import { Test } from '@nestjs/testing';
import { fakeUserObject } from '@test/unit/mock/fake-user-object.mock';
import { Response } from 'express';

describe('CreateUserController', () => {
  let createUserService: CreateUserService;
  let sut: CreateUserController;

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
          provide: CreateUserService,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue({ user: expectedUser.toHTTP() }),
          },
        },
      ],
      controllers: [CreateUserController],
    }).compile();
    // Get service
    createUserService = moduleFixture.get(CreateUserService);
    // Get controller
    sut = moduleFixture.get(CreateUserController);
  });

  describe('execute', () => {
    const body = {
      email: 'bob@gmail.com',
      name: 'bob',
      password: '12345678',
    };

    it('should be able to create user', async () => {
      const spy = fakeResponseJsonFunc;
      await sut.handle(body, fakeResponse);
      expect(spy).toBeCalledWith({ user: expectedUser.toHTTP() });
    });

    it('should call CreateUserService::execute with right parameters', async () => {
      const spy = jest.spyOn(createUserService, 'execute');
      await sut.handle(body, fakeResponse);
      expect(spy).toBeCalledWith(body);
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if CreateUserService::execute throws unknown error', async () => {
      jest
        .spyOn(createUserService, 'execute')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.handle(body, fakeResponse);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
