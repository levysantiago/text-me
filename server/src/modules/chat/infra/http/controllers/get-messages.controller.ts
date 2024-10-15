import { GetMessagesService } from '@modules/chat/services/get-messages.service';
import { Controller, Get, Req, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiGlobalHeaders } from '@shared/infra/http/decorators/api-global-headers.decorator';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { Request as ExpressRequest, Response as IResponse } from 'express';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
@ApiTags("Chat")
@ApiGlobalHeaders()
@ApiBearerAuth()
export class GetMessagesController {
  constructor(private getMessagesService: GetMessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('chat/:fromUserId/')
  async handle(@Req() req: IRequest, @Response() res: IResponse) {
    const { fromUserId } = req.params;

    const { data } = await this.getMessagesService.execute({
      fromUserId: fromUserId as string,
      toUserId: req.user.userId,
    });
    return res.status(200).json({ data });
  }
}
