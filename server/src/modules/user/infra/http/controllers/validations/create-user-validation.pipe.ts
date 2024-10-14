import { createZodDto } from '@anatine/zod-nestjs';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { AppValidationError } from '@shared/resources/errors/app-validation.error';
import { z } from 'zod';

extendZodWithOpenApi(z)

export const createUserBodySchema = z.object({
  email: z.string().email().openapi({
    title: "Email",
    description: "The email of the user",
    example: "john@gmail.com",
  }),
  name: z.string().openapi({
    title: "Name",
    description: "The name of the user",
    example: "John",
  }),
  password: z.string().min(8).openapi({
    title: "Password",
    description: "The password of the user",
    example: "12345678",
  }),
});

export class CreateUserBodyDTO extends createZodDto(createUserBodySchema){}

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
