import { EmailAlreadyExistsError } from '@modules/user/errors/email-already-exists.error';
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from '@shared/infra/filters/exeption.filter';
import { ErrorMessageManager } from '@shared/resources/errors/error-message-manager';
import { IErrorMessages } from '@shared/resources/errors/types/ierror-messages';

describe('Exception Filter', () => {
  let sut: HttpExceptionFilter;

  const fakeResponseJsonFunc = jest.fn();
  const fakeResponse = {
    status: jest.fn().mockReturnValue({ json: fakeResponseJsonFunc }),
  } as any as Response;
  const fakeRequest = {
    headers: {
      'Accept-Language': 'en',
    },
    url: 'fake-url',
  };

  const fakeHost = {
    switchToHttp: () => ({
      getResponse: () => fakeResponse,
      getRequest: () => fakeRequest,
    }),
  } as any as ArgumentsHost;

  const fakeErrorMessages = {
    INTERNAL_SERVER_ERROR: '1',
    EMAIL_ALREADY_EXISTS_ERROR: '2',
    INVALID_EMAIL_OR_PASSWORD_ERROR: '3',
    MESSAGES_NOT_FOUND_ERROR: '4',
    RESOURCE_NOT_FOUND_ERROR: '5',
  } as any as IErrorMessages;

  beforeAll(() => {
    jest
      .spyOn(ErrorMessageManager, 'getMessages')
      .mockReturnValue(fakeErrorMessages);

    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    // Create testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();
    // Get exception filter
    sut = moduleFixture.get(HttpExceptionFilter);
  });

  describe('catch', () => {
    const exception = new EmailAlreadyExistsError({ reason: 'my reason' });

    it('should be able to handle AppError', async () => {
      const spyStatus = fakeResponse.status;
      const spyJson = fakeResponseJsonFunc;
      sut.catch(exception, fakeHost);

      expect(spyStatus).toBeCalledWith(400);
      expect(spyJson).toBeCalledWith({
        statusCode: exception.getStatus(),
        error: exception.messageId,
        message: fakeErrorMessages.EMAIL_ALREADY_EXISTS_ERROR,
        reason: 'my reason',
        timestamp: new Date().toISOString(),
        path: fakeRequest.url,
      });
    });

    it('should be able to handle unknown error', async () => {
      const spyStatus = fakeResponse.status;
      const spyJson = fakeResponseJsonFunc;
      sut.catch(new HttpException('unknown', 500), fakeHost);

      expect(spyStatus).toBeCalledWith(500);
      expect(spyJson).toBeCalledWith({
        statusCode: 500,
        error: 'INTERNAL_SERVER_ERROR',
        message: fakeErrorMessages.INTERNAL_SERVER_ERROR,
        reason: 'unknown',
        timestamp: new Date().toISOString(),
        path: fakeRequest.url,
      });
    });

    it('should be able to call ErrorMessageManager::getMessages with right parameters', async () => {
      const spy = jest.spyOn(ErrorMessageManager, 'getMessages');
      const fakeRequestNoHeaders = {
        headers: {},
        url: 'fake-url',
      };
      sut.catch(exception, {
        switchToHttp: () => ({
          getResponse: () => fakeResponse,
          getRequest: () => fakeRequestNoHeaders,
        }),
      } as any as ArgumentsHost);
      expect(spy).toBeCalledWith("errors", 'en');
    });

    it('should be able to define "en" as default locale', async () => {
      const spy = jest.spyOn(ErrorMessageManager, 'getMessages');
      sut.catch(exception, fakeHost);
      expect(spy).toBeCalledWith("errors", 'en');
    });
  });
});
