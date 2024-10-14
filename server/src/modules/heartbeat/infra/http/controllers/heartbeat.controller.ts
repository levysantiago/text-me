import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('/')
@ApiTags("Heartbeat")
export class HeartbeatController {
  @Get('/')
  async handle(@Res() response: Response) {
    return response.status(200).json({ data: 'TextMe Server is UP!' });
  }
}
