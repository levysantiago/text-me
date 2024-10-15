import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiGlobalHeaders } from '@shared/infra/http/decorators/api-global-headers.decorator';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('api')
@ApiTags("Auth")
@ApiGlobalHeaders()
@ApiBearerAuth()
export class CheckLoginController {
  @Get('auth/check')
  @UseGuards(JwtAuthGuard)
  async handle(@Res() response: Response) {
    response.status(200).send();
  }
}
