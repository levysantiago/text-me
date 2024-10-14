import { HttpException } from '@nestjs/common';
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
}
