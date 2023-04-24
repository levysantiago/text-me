import {
  Body,
  Controller,
  Put,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Response as IResponse } from 'express';
import { CreateUserDTO } from 'src/app/dtos/create-user-dto';
import { UpdateUserService } from 'src/app/services/update-user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
export class UpdateUserController {
  constructor(private updateUserService: UpdateUserService) {}

  @Put('user')
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body() body: CreateUserDTO,
    @Req() req,
    @Response() res: IResponse,
  ) {
    const { name, password } = body;

    await this.updateUserService.execute({
      id: req.user.userId,
      name,
      password,
    });
    return res.status(200).send();
  }
}
