import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { AppValidationError } from '@shared/resources/errors/app-validation.error';
import { z } from 'zod';

const authBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type IAuthBody = z.infer<typeof authBodySchema>;

export class AuthValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let schema: z.ZodObject<any>;

    switch (metadata.type) {
      case 'body': {
        schema = authBodySchema;
        break;
      }

      default: {
        schema = authBodySchema;
      }
    }

    // Validating schema
    const schemaValidation = schema.safeParse(value);
    if (schemaValidation.success !== true) {
      throw new AppValidationError(schemaValidation.error.issues);
    }

    return schemaValidation.data;
  }
}
