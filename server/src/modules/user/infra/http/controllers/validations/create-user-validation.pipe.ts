import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { AppValidationError } from '@shared/resources/errors/app-validation.error';
import { z } from 'zod';

const createUserBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
});

export type ICreateUserBody = z.infer<typeof createUserBodySchema>;

export class CreateUserValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let schema: z.ZodObject<any>;

    switch (metadata.type) {
      case 'body': {
        schema = createUserBodySchema;
        break;
      }

      default: {
        schema = createUserBodySchema;
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
