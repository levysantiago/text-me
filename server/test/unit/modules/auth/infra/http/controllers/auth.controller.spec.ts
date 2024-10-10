import { AuthController } from '@modules/auth/infra/http/controllers/auth.controller';
import { AuthService } from '@modules/auth/services/auth.service';
import { Test } from '@nestjs/testing';
import { Response } from 'express';

describe('AuthController', () => {
  let authService: AuthService;
  let sut: AuthController;

  const fakeResponseJsonFunc = jest.fn();
  const fakeResponse = {
    status: jest.fn().mockReturnValue({ json: fakeResponseJsonFunc }),
  } as any as Response;

  beforeEach(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue({ access_token: 'fake-token' }),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();
    // Get service
    authService = moduleFixture.get(AuthService);
    // Get controller
    sut = moduleFixture.get(AuthController);
  });

  describe('execute', () => {
    const body = {
      email: 'bob@gmail.com',
      password: '12345678',
    };

    it('should be able to authenticate user', async () => {
      const spy = fakeResponseJsonFunc;
      await sut.handle(body, fakeResponse);
      expect(spy).toBeCalledWith({ data: { access_token: 'fake-token' } });
    });

    it('should call AuthService::execute with right parameters', async () => {
      const spy = jest.spyOn(authService, 'execute');
      await sut.handle(body, fakeResponse);
      expect(spy).toBeCalledWith(body);
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if AuthService::execute throws unknown error', async () => {
      jest
        .spyOn(authService, 'execute')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.handle(body, fakeResponse);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
