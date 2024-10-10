import { AppError } from '@shared/resources/errors/app.error';

export class MessagesNotFoundError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super('MESSAGES_NOT_FOUND_ERROR', {
      status: 404,
      reason: options.reason,
    });
  }
}
