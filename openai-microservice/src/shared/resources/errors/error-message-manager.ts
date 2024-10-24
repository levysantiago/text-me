import { readFileSync } from 'node:fs'
import { IErrorMessages } from './types/ierror-message-id'
import { AppError } from './app.error'
import { resolve } from 'node:path'
import { ILocale } from '../types/ilocale'

export class ErrorMessageManager {
  static getMessages(locale: ILocale): IErrorMessages {
    if (locale !== 'en' && locale !== 'pt') {
      throw new AppError('INTERNAL_SERVER_ERROR', {
        status: 500,
        reason: `Locale is invalid. Locale received: ${locale}`,
      })
    }

    // Reading error file
    const messagesContent = readFileSync(
      resolve(__dirname, `../lang/${locale}/errors.json`),
      {
        encoding: 'utf-8',
      },
    )

    // Transform error file to object
    const messagesObj: IErrorMessages = JSON.parse(messagesContent)

    // Return messages
    return messagesObj
  }

  static getUserExcuseMessage(): string {
    return "Sorry, I'm a little busy now, but I will answer you later."
  }
}
