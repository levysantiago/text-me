import { GetFriendsService } from '@modules/friendship/services/get-friends.service';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
export class GetFriendsController {
  constructor(private getFriendsService: GetFriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('friend')
  async handle(@Request() req: IRequest) {
    const { data } = await this.getFriendsService.execute({
      userId: req.user.userId,
    });

    return { data };
  }
}
