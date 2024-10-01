import { UpdateUserService } from '@modules/user/services/update-user.service';
import {
  Body,
  Controller,
  Put,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/infra/http/guards/jwt-auth.guard';
import { Response as IResponse } from 'express';

@Controller('api')
export class UpdateUserController {
  constructor(private updateUserService: UpdateUserService) {}

  @Put('user')
  @UseGuards(JwtAuthGuard)
  async handle(@Body() body: any, @Req() req, @Response() res: IResponse) {
    const { name, password } = body;

    const data = await this.updateUserService.execute({
      id: req.user.userId,
      name,
      password,
    });
    return res.status(200).send(data);
  }
}
