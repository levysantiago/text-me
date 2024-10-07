import { AppError } from '@shared/resources/errors/app.error';

export class UserNotFoundError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super('RESOURCE_NOT_FOUND_ERROR', {
      status: 404,
      reason:
        options.reason ||
        'User could not be found, please, verify if you are registered.',
    });
  }
}
