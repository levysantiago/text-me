import { ILocale } from '../types/ilocale';
import { readFileSync } from 'node:fs';
import { IErrorMessages } from './types/ierror-messages';
import { resolve } from 'node:path';
import { IValidationErrorMessages } from './types/ivalidation-error-messages';

type IMessageType = 'errors' | 'validation-errors';

export class ErrorMessageManager {
  static getMessages<T extends IErrorMessages | IValidationErrorMessages>(
    type: IMessageType,
    locale: ILocale,
  ): T {
    let _locale = locale;
    if (_locale !== 'en' && _locale !== 'pt') {
      _locale = 'en';
    }

    // Reading error file
    const messagesContent = readFileSync(
      resolve(__dirname, `../lang/${_locale}/${type}.json`),
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
