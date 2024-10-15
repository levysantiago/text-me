import { UpdateUserResponseDTO } from '@modules/user/services/dtos/update-user-repsonse-dto';
import { UpdateUserService } from '@modules/user/services/update-user.service';
import {
  Body,
  Controller,
  Put,
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
import { Response as IResponse } from 'express';
import { UpdateUserBodyDTO, UpdateUserValidationPipe } from './validations/update-user-validation.pipe';

@Controller('api')
@ApiTags("User")
@ApiGlobalHeaders()
@ApiBearerAuth()
export class UpdateUserController {
  constructor(private updateUserService: UpdateUserService) {}

  @Put('user')
  @UseGuards(JwtAuthGuard)
  @UsePipes(UpdateUserValidationPipe)
  @ApiOperation({
    summary: "Update user attributes.",
  })
  @ApiOkResponse({
    type: UpdateUserResponseDTO
  })
  @ApiResponse({
    type: AppErrorDTO,
    status: 500
  })
  @ApiResponse({
    type: AppValidationErrorDTO,
    status:400
  })
  async handle(@Body() body: UpdateUserBodyDTO, @Req() req, @Response() res: IResponse) {
    const { name, password } = body;

    const data = await this.updateUserService.execute({
      id: req.user.userId,
      name,
      password,
    });
    return res.status(200).json(data);
  }
}
