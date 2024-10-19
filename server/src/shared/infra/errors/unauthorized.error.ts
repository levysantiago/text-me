import { HttpStatus } from '@nestjs/common';
import { AppError } from '@shared/resources/errors/app.error';

export class UnauthorizedError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super('UNAUTHORIZED', {
      status: HttpStatus.UNAUTHORIZED,
      reason: options.reason,
    });
  }
}
