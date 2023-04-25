import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { GetFriendsService } from 'src/app/services/get-friends.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
export class GetFriendsController {
  constructor(private getFriendsService: GetFriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('friend')
  async handle(@Request() req: IRequest) {
    const { data } = await this.getFriendsService.execute(req.user.userId);

    return { data };
  }
}
