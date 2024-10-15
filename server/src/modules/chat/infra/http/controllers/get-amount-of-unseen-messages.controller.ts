import { GetAmountOfUnseenMessagesResponseDTO } from '@modules/chat/services/dtos/get-amount-of-unseen-messages-response-dto';
import { GetFriendsMessagesResumeService } from '@modules/chat/services/get-friends-messages-resume.service';
import { Controller, Get, Req, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGlobalHeaders } from '@shared/infra/http/decorators/api-global-headers.decorator';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { AppErrorDTO } from '@shared/resources/errors/dtos/app-error-dto';
import { AppValidationErrorDTO } from '@shared/resources/errors/dtos/app-validation-error-dto';
import { Request as ExpressRequest, Response as IResponse } from 'express';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
@ApiTags("Chat")
@ApiGlobalHeaders()
@ApiBearerAuth()
export class GetAmountOfUnseenMessagesController {
  constructor(
    private getFriendsMessagesResumeService: GetFriendsMessagesResumeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('chat/amount/unseen')
  @ApiOperation({
    summary: "Returns a resume of the unseen messages.",
  })
  @ApiOkResponse({
    description: "Valid response. Each UUID key corresponds to a friend who texted the user.",
    type: GetAmountOfUnseenMessagesResponseDTO
  })
  @ApiResponse({
    type: AppErrorDTO,
    description: "App Error",
    status: 500
  })
  @ApiResponse({
    type: AppValidationErrorDTO,
    description: "Arguments validation error.",
    status:400
  })
  async handle(@Req() req: IRequest, @Response() res: IResponse) {
    const data = await this.getFriendsMessagesResumeService.execute({
      toUserId: req.user.userId,
    });
    return res.status(200).json(data);
  }
}
