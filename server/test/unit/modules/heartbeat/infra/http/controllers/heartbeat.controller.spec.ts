import { HeartbeatController } from '@modules/heartbeat/infra/http/controllers/heartbeat.controller';
import { Test } from '@nestjs/testing';
import { Response } from 'express';

describe('HeartbeatController', () => {
  let sut: HeartbeatController;

  const fakeResponseJsonFunc = jest.fn();
  const fakeResponse = {
    status: jest.fn().mockReturnValue({ json: fakeResponseJsonFunc }),
  } as any as Response;

  beforeEach(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      controllers: [HeartbeatController],
    }).compile();
    // Get controller
    sut = moduleFixture.get(HeartbeatController);
  });

  describe('execute', () => {
    it('should be able to authenticate user', async () => {
      const spy = fakeResponseJsonFunc;
      await sut.handle(fakeResponse);
      expect(spy).toBeCalledWith({ data: 'TextMe Server is UP!' });
    });
  });
});
