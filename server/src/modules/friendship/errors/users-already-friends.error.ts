import { AppError } from '@shared/resources/errors/app.error';

export class UsersAlreadyFriendsError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super('USERS_ALREADY_FRIENDS_ERROR', {
      status: 400,
    });
  }
}
