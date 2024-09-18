import { AddFriendService } from '@modules/friendship/services/add-friend.service';
import {
  Body,
  Controller,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { Response as IResponse, Request as ExpressRequest } from 'express';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
export class AddFriendshipController {
  constructor(private addFriendService: AddFriendService) {}

  @UseGuards(JwtAuthGuard)
  @Post('friend')
  async handle(
    @Body() body: any,
    @Req() req: IRequest,
    @Response() res: IResponse,
  ) {
    const { friendEmail } = body;

    await this.addFriendService.execute({
      friendEmail,
      userId: req.user.userId,
    });
    return res.status(200).send();
  }
}
