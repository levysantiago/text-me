import { AppError } from '@shared/resources/errors/app.error'

export class MicroserviceNotLoggedError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super('MICROSERVICE_NOT_LOGGED_ERROR', {
      status: 400,
      reason: options.reason || '',
    })
  }
}
