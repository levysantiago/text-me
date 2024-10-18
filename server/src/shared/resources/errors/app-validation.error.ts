import { HttpException } from '@nestjs/common';
import { IErrorMessages } from './types/ierror-messages';
import { ZodIssue } from 'zod';
import { IValidation } from './types/ivalidation';
import { ILocale } from '../types/ilocale';
import { ErrorMessageManager } from './error-message-manager';
import { IValidationErrorMessages } from './types/ivalidation-error-messages';
import { AppValidationErrorDTO } from './dtos/app-validation-error-dto';

export class AppValidationError extends HttpException {
  public messageId: keyof IErrorMessages;
  public reason: string;
  public details: IValidation[];
  public locale: ILocale;
  public zodErrors: ZodIssue[];

  constructor(errors: ZodIssue[] = [], options: { status?: number } = {}) {
    super('', options.status || 400);
    this.messageId = 'VALIDATION_ERROR';
    this.zodErrors = errors;
  }

  private formatZodErrors(errors: ZodIssue[]): IValidation[] {
    return errors.map((zodError) => {
      let validation = '';

      switch (zodError.code) {
        case 'invalid_type': {
          if (zodError.received === 'undefined') {
            validation = 'required';
          } else {
            validation = zodError.expected;
          }
          break;
        }

        case 'invalid_string': {
          validation = zodError.validation.toString();
          break;
        }

        case 'too_small': {
          validation = 'min';
          break;
        }

        default:
          break;
      }

      const validationError: IValidation = {
        field: zodError.path[0].toString(),
        validation,
        issue: zodError.message,
      };

      return validationError;
    });
  }

  private formatValidationErrorMessages(
    errors: IValidation[],
    locale: ILocale,
  ): Array<IValidation> {
    return errors.map((error) => {
      const code = `${error.field}.${error.validation}`;
      const messages =
        ErrorMessageManager.getMessages<IValidationErrorMessages>(
          'validation-errors',
          locale,
        );

      const message: string = messages[code];
      if (!message) {
        return {
          issue: error.issue,
          field: error.field,
          validation: error.validation,
          options: error.options,
        };
      }

      return {
        issue: message,
        field: error.field,
        validation: error.validation,
        options: error.options,
      };
    });
  }

  public toJson(requestPath: string, locale: ILocale): AppValidationErrorDTO {
    const validationErrors = this.formatZodErrors(this.zodErrors);
    this.details = this.formatValidationErrorMessages(
      validationErrors,
      locale || 'en',
    );

    return {
      statusCode: this.getStatus(),
      error: this.messageId,
      message: locale === 'pt' ? 'Erro de validação' : 'Validation error',
      details: this.details,
      timestamp: new Date().toISOString(),
      path: requestPath,
    };
  }
}
