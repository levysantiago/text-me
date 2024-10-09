import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { AppError } from '@shared/resources/errors/app.error';
import { ErrorMessageManager } from '@shared/resources/errors/error-message-manager';
import { IErrorMessages } from '@shared/resources/errors/types/ierror-message-id';
import { ILocale } from '@shared/resources/types/ilocale';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const locale: ILocale = (request.headers['Accept-Language'] || 'en') as any;
    const status = exception.getStatus();
    const errorMessages = ErrorMessageManager.getMessages(locale);

    if (exception instanceof AppError) {
      return response.status(status).json({
        statusCode: status,
        error: exception.messageId,
        message: errorMessages[exception.messageId],
        reason: exception.reason,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    console.log(exception);

    const defaultErrorMessageId: keyof IErrorMessages = 'INTERNAL_SERVER_ERROR';

    return response.status(status).json({
      statusCode: 500,
      error: defaultErrorMessageId,
      message: errorMessages.INTERNAL_SERVER_ERROR,
      reason: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
