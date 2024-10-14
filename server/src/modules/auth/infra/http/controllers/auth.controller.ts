import { AuthService } from '@modules/auth/services/auth.service';
import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  AuthValidationPipe,
  IAuthBody,
} from './validations/auth-validation.pipe';

@Controller('api')
@ApiTags("Auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth')
  @UsePipes(AuthValidationPipe)
  async handle(@Body() body: IAuthBody, @Res() response: Response) {
    const { email, password } = body;

    const { access_token } = await this.authService.execute({
      email,
      password,
    });

    return response.status(200).json({ data: { access_token } });
  }
}
