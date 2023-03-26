import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/app/services/auth.service';
import { z } from 'zod';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth')
  async login(@Body() body, @Res() response: Response) {
    const createAuthUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    try {
      const { email, password } = createAuthUserBodySchema.parse(body);

      const { access_token } = await this.authService.execute(email, password);

      return response.status(200).json({ data: { access_token } });
    } catch (e) {
      if (e instanceof z.ZodError) {
        throw new HttpException(
          { reason: 'Validation error', errors: e.errors },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
