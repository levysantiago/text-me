import { AppError } from '@shared/resources/errors/app.error';

export class EmailAlreadyExistsError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super('EMAIL_ALREADY_EXISTS_ERROR', {
      status: 400,
      reason: options.reason,
    });
  }
}
