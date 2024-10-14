import { HttpException } from '@nestjs/common';
import { IErrorMessages } from './types/ierror-messages';
import { ZodIssue } from 'zod';
import { IValidation } from './types/ivalidation';
import { ILocale } from '../types/ilocale';
import { ErrorMessageManager } from './error-message-manager';
import { IValidationErrorMessages } from './types/ivalidation-error-messages';
import { AppErrorDTO } from './dtos/app-error-dto';
import { AppValidationErrorDTO } from './dtos/app-validation-error-dto';

export class AppValidationError extends HttpException {
  public messageId: keyof IErrorMessages;
  public reason: string;
  public details: IValidation[];
  public locale: ILocale;

  constructor(
    errors: ZodIssue[] = [],
    options: { status?: number; locale?: ILocale } = {},
  ) {
    super('', options.status || 400);
    this.messageId = 'VALIDATION_ERROR';
    this.locale = options.locale || 'en';
    const validationErrors = this.formatZodErrors(errors);
    this.details = this.formatValidationErrorMessages(
      validationErrors,
      this.locale,
    );
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
          validation = zodError.validation.toString()
          break;
        }

        case 'too_small': {
          validation = "min"
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

  public toJson(requestPath: string): AppValidationErrorDTO {
    const errorMessages = ErrorMessageManager.getMessages<IErrorMessages>(
      'errors',
      this.locale,
    );

    return {
      statusCode: this.getStatus(),
      error: this.messageId,
      message: errorMessages[this.messageId],
      details: this.details,
      timestamp: new Date().toISOString(),
      path: requestPath,
    };
  }
}
