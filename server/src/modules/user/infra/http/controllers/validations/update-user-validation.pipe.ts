import { createZodDto } from '@anatine/zod-nestjs';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { AppValidationError } from '@shared/resources/errors/app-validation.error';
import { z } from 'zod';
extendZodWithOpenApi(z)

const updateUserBodySchema = z.object({
  name: z.string().optional().openapi({
    title: "Name",
    description: "The name of the user",
    example: "John",
  }),
  password: z.string().min(8).optional().openapi({
    title: "Password",
    description: "The password of the user",
    example: "12345678",
  }),
});

export class UpdateUserBodyDTO extends createZodDto(updateUserBodySchema){}

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
