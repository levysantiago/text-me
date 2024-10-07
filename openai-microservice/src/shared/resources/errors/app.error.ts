import { IErrorMessages } from './types/ierror-message-id'
import { FastifyError } from 'fastify'

export class AppError extends Error implements FastifyError {
  public messageId: keyof IErrorMessages
  public reason: string
  public status: number
  public code: string

  constructor(
    messageId: keyof IErrorMessages,
    options: { status?: number; reason?: string },
  ) {
    super('')
    this.status = options.status || 500
    this.messageId = messageId || 'INTERNAL_SERVER_ERROR'
    this.code = this.messageId as string
    this.reason = options.reason || ''
  }
}
