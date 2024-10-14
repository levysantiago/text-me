import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { AppValidationError } from '@shared/resources/errors/app-validation.error';
import { z } from 'zod';

const updateUserBodySchema = z.object({
  name: z.string(),
  password: z.string().min(8),
});

export type IUpdateUserBody = z.infer<typeof updateUserBodySchema>;

export class UpdateUserValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let schema: z.ZodObject<any>;

    switch (metadata.type) {
      case 'body': {
        schema = updateUserBodySchema;
        break;
      }

      default: {
        schema = updateUserBodySchema;
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
