import { GetFriendsService } from '@modules/friendship/services/get-friends.service';
import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
export class GetFriendsController {
  constructor(private getFriendsService: GetFriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('friend')
  async handle(@Request() req: IRequest, @Response() res: ExpressResponse) {
    const { data } = await this.getFriendsService.execute({
      userId: req.user.userId,
    });

    return res.status(200).json({ data });
  }
}
