import { GetMessagesService } from '@modules/chat/services/get-messages.service';
import { Controller, Get, Req, Response, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { Request as ExpressRequest, Response as IResponse } from 'express';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
export class GetMessagesController {
  constructor(private getMessagesService: GetMessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('chat')
  async handle(@Req() req: IRequest, @Response() res: IResponse) {
    const { fromUserId } = req.query;
    console.log('fromUserId', fromUserId);

    const { data } = await this.getMessagesService.execute({
      fromUserId: fromUserId as string,
      toUserId: req.user.userId,
    });
    return res.status(200).json({ data });
  }
}
