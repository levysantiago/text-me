import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('api')
@ApiTags("Auth")
export class CheckLoginController {
  @Get('auth/check')
  @UseGuards(JwtAuthGuard)
  async handle(@Res() response: Response) {
    response.status(200).send();
  }
}
