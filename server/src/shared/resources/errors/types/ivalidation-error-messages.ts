import validationErrorsEn from '@shared/resources/lang/en/validation-errors.json';

export type IValidationErrorMessages = typeof validationErrorsEn;

export type IValidationErrorMessageId = keyof IValidationErrorMessages;
