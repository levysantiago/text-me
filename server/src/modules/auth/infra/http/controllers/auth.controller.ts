import { AuthService } from '@modules/auth/services/auth.service';
import { AuthResponseDTO } from '@modules/auth/services/dtos/auth-response-dto';
import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGlobalHeaders } from '@shared/infra/http/decorators/api-global-headers.decorator';
import { AppErrorDTO } from '@shared/resources/errors/dtos/app-error-dto';
import { AppValidationErrorDTO } from '@shared/resources/errors/dtos/app-validation-error-dto';
import { Response } from 'express';
import {
  AuthValidationPipe,
  IAuthBody,
} from './validations/auth-validation.pipe';

@Controller('api')
@ApiTags("Auth")
@ApiGlobalHeaders()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth')
  @UsePipes(AuthValidationPipe)
  @ApiOperation({
    summary: "Authenticates a registered user / Login route.",
  })
  @ApiOkResponse({
    type: AuthResponseDTO,
    description: "Valid response.",
  })
  @ApiResponse({
    type: AppErrorDTO,
    description: "App Error",
    status: 500
  })
  @ApiResponse({
    type: AppValidationErrorDTO,
    description: "Arguments validation error.",
    status:400
  })
  async handle(@Body() body: IAuthBody, @Res() response: Response) {
    const { email, password } = body;

    const data = await this.authService.execute({
      email,
      password,
    });

    return response.status(200).json(data);
  }
}
