import { HttpException } from '@nestjs/common';
import { ILocale } from '../types/ilocale';
import { AppErrorDTO } from './dtos/app-error-dto';
import { ErrorMessageManager } from './error-message-manager';
import { IErrorMessages } from './types/ierror-messages';

export class AppError extends HttpException {
  public messageId: keyof IErrorMessages;
  public reason: string;

  constructor(
    messageId: keyof IErrorMessages,
    options: { status?: number; reason?: string },
  ) {
    super('', options.status || 400);
    this.messageId = messageId || 'INTERNAL_SERVER_ERROR';
    this.reason = options.reason || '';
  }

  toJson(path: string, locale: ILocale): AppErrorDTO {
    const errorMessages = ErrorMessageManager.getMessages<IErrorMessages>(
      'errors',
      locale,
    );

    return {
      statusCode: this.getStatus(),
      error: this.messageId,
      message: errorMessages[this.messageId],
      reason: this.reason,
      timestamp: new Date().toISOString(),
      path,
    };
  }
}
