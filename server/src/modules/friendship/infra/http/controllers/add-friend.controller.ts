import { AddFriendService } from '@modules/friendship/services/add-friend.service';
import {
  Body,
  Controller,
  Post,
  Req,
  Response,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGlobalHeaders } from '@shared/infra/http/decorators/api-global-headers.decorator';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { AppErrorDTO } from '@shared/resources/errors/dtos/app-error-dto';
import { AppValidationErrorDTO } from '@shared/resources/errors/dtos/app-validation-error-dto';
import { Response as IResponse, Request as ExpressRequest } from 'express';
import { AddFriendBodyDTO, AddFriendValidationPipe } from './validations/add-friend-validation.pipe';

interface IRequest extends ExpressRequest {
  user: { userId: string; sub: string };
}

@Controller('api')
@ApiTags("Friendship")
@ApiGlobalHeaders()
@ApiBearerAuth()
export class AddFriendController {
  constructor(private addFriendService: AddFriendService) {}
  
  @Post('friend')
  @UseGuards(JwtAuthGuard)
  @UsePipes(AddFriendValidationPipe)
  @ApiOperation({
    summary: "Add a user as a friend.",
  })
  @ApiOkResponse()
  @ApiResponse({
    type: AppErrorDTO,
    status: 500
  })
  @ApiResponse({
    type: AppValidationErrorDTO,
    status:400
  })
  async handle(
    @Body() body: AddFriendBodyDTO,
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
