import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGlobalHeaders } from '@shared/infra/http/decorators/api-global-headers.decorator';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { AppErrorDTO } from '@shared/resources/errors/dtos/app-error-dto';
import { Response } from 'express';

@Controller('api')
@ApiTags("Auth")
@ApiGlobalHeaders()
@ApiBearerAuth()
export class CheckLoginController {
  @Get('auth/check')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Checks if user is logged.",
  })
  @ApiOkResponse({
    description: "Valid response.",
  })
  @ApiResponse({
    type: AppErrorDTO,
    example: {
      statusCode: 401,
      error: "UNAUTHORIZED",
      message: "Unauthorized",
      reason: "",
      timestamp: "2024-10-14T19:06:52.956Z",
      path: "api/auth/check",
    } as AppErrorDTO,
    description: "App Error. If user not logged it will throw 'UNAUTHORIZED' with status 401.",
    status: 500
  })
  async handle(@Res() response: Response) {
    response.status(200).send();
  }
}
