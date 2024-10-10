import { AuthService } from '@modules/auth/services/auth.service';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth')
  async handle(@Body() body, @Res() response: Response) {
    const createAuthUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = createAuthUserBodySchema.parse(body);

    const { access_token } = await this.authService.execute({
      email,
      password,
    });

    return response.status(200).json({ data: { access_token } });
  }
}
