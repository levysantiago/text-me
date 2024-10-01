import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/')
export class HeartbeatController {
  @Get('/')
  async login(@Res() response: Response) {
    return response.status(200).json({ data: 'TextMe Server is UP!' });
  }
}
