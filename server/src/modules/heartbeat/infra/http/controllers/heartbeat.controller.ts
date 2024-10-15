import { Controller, Get, Res } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppErrorDTO } from '@shared/resources/errors/dtos/app-error-dto';
import { Response } from 'express';

@Controller('/')
@ApiTags("Heartbeat")
export class HeartbeatController {
  @Get('/')
  @ApiOkResponse({
    example: {data: "TextMe Server is UP!"}
  })
  @ApiResponse({
    type: AppErrorDTO,
    status: 500
  })
  async handle(@Res() response: Response) {
    return response.status(200).json({ data: 'TextMe Server is UP!' });
  }
}
