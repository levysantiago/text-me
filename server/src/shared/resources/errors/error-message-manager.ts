import { ILocale } from '../types/ilocale';
import { readFileSync } from 'node:fs';
import { IErrorMessages } from './types/ierror-messages';
import { AppError } from './app.error';
import { resolve } from 'node:path';
import { IValidationErrorMessages } from './types/ivalidation-error-messages';

type IMessageType = 'errors' | 'validation-errors';

export class ErrorMessageManager {
  static getMessages<T extends IErrorMessages | IValidationErrorMessages>(
    type: IMessageType,
    locale: ILocale,
  ): T {
    if (locale !== 'en' && locale !== 'pt') {
      throw new AppError('INTERNAL_SERVER_ERROR', {
        status: 500,
        reason: `Locale is invalid. Locale received: ${locale}`,
      });
    }

    // Reading error file
    const messagesContent = readFileSync(
      resolve(__dirname, `../lang/${locale}/${type}.json`),
      {
        encoding: 'utf-8',
      },
    );

    // Transform error file to object
    const messagesObj = JSON.parse(messagesContent);

    // Return messages
    return messagesObj;
  }
}
