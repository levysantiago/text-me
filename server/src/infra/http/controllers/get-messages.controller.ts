import { Controller, Get, Req, Response, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest, Response as IResponse } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetMessagesService } from 'src/app/services/get-messages.service';

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

    const { data } = await this.getMessagesService.execute({
      fromUserId: fromUserId as string,
      toUserId: req.user.userId,
    });
    return res.status(200).json({ data });
  }
}
