import { Controller, Get, Req, Response, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest, Response as IResponse } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetFriendsMessagesResumeService } from 'src/app/services/get-friends-messages-resume.service';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
export class GetFriendsMessagesResumeController {
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
