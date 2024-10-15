import { GetMessagesResponseDTO } from '@modules/chat/services/dtos/get-messages-response-dto';
import { GetMessagesService } from '@modules/chat/services/get-messages.service';
import { Controller, Get, Req, Response, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiGlobalHeaders } from '@shared/infra/http/decorators/api-global-headers.decorator';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { AppErrorDTO } from '@shared/resources/errors/dtos/app-error-dto';
import { AppValidationErrorDTO } from '@shared/resources/errors/dtos/app-validation-error-dto';
import { Request as ExpressRequest, Response as IResponse } from 'express';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
@ApiTags('Chat')
@ApiGlobalHeaders()
@ApiBearerAuth()
export class GetMessagesController {
  constructor(private getMessagesService: GetMessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('chat/:fromUserId/')
  @ApiOperation({
    summary: 'Returns the chat messages of a conversation with a friend.',
  })
  @ApiOkResponse({
    description: 'Valid response.',
    type: GetMessagesResponseDTO,
  })
  @ApiResponse({
    type: AppErrorDTO,
    description: 'App Error',
    status: 500,
  })
  @ApiResponse({
    type: AppValidationErrorDTO,
    description: 'Arguments validation error.',
    status: 400,
  })
  async handle(@Req() req: IRequest, @Response() res: IResponse) {
    const { fromUserId } = req.params;

    const data = await this.getMessagesService.execute({
      fromUserId: fromUserId as string,
      toUserId: req.user.userId,
    });
    return res.status(200).json(data);
  }
}
