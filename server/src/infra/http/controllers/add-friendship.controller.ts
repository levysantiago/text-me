import {
  Body,
  Controller,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Response as IResponse, Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFriendshipDTO } from 'src/app/dtos/create-friendship-dto';
import { AddFriendService } from 'src/app/services/add-friend.service';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
export class AddFriendshipController {
  constructor(private addFriendService: AddFriendService) {}

  @Post('friend')
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body() body: CreateFriendshipDTO,
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
