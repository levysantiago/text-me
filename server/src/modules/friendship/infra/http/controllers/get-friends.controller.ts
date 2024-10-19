import { GetFriensResponseDTO } from '@modules/friendship/services/dtos/get-friends-response-dto';
import { GetFriendsService } from '@modules/friendship/services/get-friends.service';
import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGlobalHeaders } from '@shared/infra/http/decorators/api-global-headers.decorator';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { AppErrorDTO } from '@shared/resources/errors/dtos/app-error-dto';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
@ApiTags("Friendship")
@ApiGlobalHeaders()
@ApiBearerAuth()
export class GetFriendsController {
  constructor(private getFriendsService: GetFriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('friend')
  @ApiOperation({
    summary: "Get the list of user's friends.",
  })
  @ApiOkResponse({
    type: GetFriensResponseDTO,
    description: "Valid response.",
  })
  @ApiResponse({
    type: AppErrorDTO,
    description: "App Error",
    status: 500
  })
  async handle(@Request() req: IRequest, @Response() res: ExpressResponse) {
    const { data } = await this.getFriendsService.execute({
      userId: req.user.userId,
    });

    return res.status(200).json({ data });
  }
}
