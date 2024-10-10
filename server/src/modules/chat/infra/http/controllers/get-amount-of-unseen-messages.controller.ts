import { GetFriendsMessagesResumeService } from '@modules/chat/services/get-friends-messages-resume.service';
import { Controller, Get, Req, Response, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { Request as ExpressRequest, Response as IResponse } from 'express';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
export class GetAmountOfUnseenMessagesController {
  constructor(
    private getFriendsMessagesResumeService: GetFriendsMessagesResumeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('chat/amount/unseen')
  async handle(@Req() req: IRequest, @Response() res: IResponse) {
    const { data } = await this.getFriendsMessagesResumeService.execute({
      toUserId: req.user.userId,
    });
    return res.status(200).json({ data });
  }
}
