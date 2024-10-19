import { createZodDto } from '@anatine/zod-nestjs';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { AppValidationError } from '@shared/resources/errors/app-validation.error';
import { z } from 'zod';
extendZodWithOpenApi(z)

const addFriendBodySchema = z.object({
  friendEmail: z.string().email(),
});

export class AddFriendBodyDTO extends createZodDto(addFriendBodySchema){}

export class AddFriendValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let schema: z.ZodObject<any>;

    switch (metadata.type) {
      case 'body': {
        schema = addFriendBodySchema;
        break;
      }

      default: {
        schema = addFriendBodySchema;
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
