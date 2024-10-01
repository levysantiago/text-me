import { AppError } from '@shared/resources/errors/app.error';

export class InvalidEmailOrPasswordError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super('INVALID_EMAIL_OR_PASSWORD_ERROR', {
      status: 400,
      reason:
        options.reason ||
        'User could not be found, please, verify if you are registered.',
    });
  }
}
