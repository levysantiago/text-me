import { CheckLoginController } from '@modules/auth/infra/http/controllers/check-login.controller';
import { Test } from '@nestjs/testing';
import { Response } from 'express';

describe('CheckLoginController', () => {
  let sut: CheckLoginController;

  const fakeResponseSendFunc = jest.fn();
  const fakeResponse = {
    status: jest.fn().mockReturnValue({ send: fakeResponseSendFunc }),
  } as any as Response;

  beforeEach(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      controllers: [CheckLoginController],
    }).compile();
    // Get controller
    sut = moduleFixture.get(CheckLoginController);
  });

  describe('execute', () => {
    it('should be able to authenticate user', async () => {
      const spy = fakeResponseSendFunc;
      await sut.handle(fakeResponse);
      expect(spy).toBeCalledWith();
    });
  });
});
