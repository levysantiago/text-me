import { AppError } from '@shared/resources/errors/app.error';

export class FriendNotFoundError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super('RESOURCE_NOT_FOUND', {
      status: 404,
      reason:
        options.reason ||
        'Friend could not be found, please, verify if this email is registered.',
    });
  }
}
