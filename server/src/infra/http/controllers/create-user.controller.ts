import { Body, Controller, Get, Post, Req, Response } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { CreateUserDTO } from 'src/app/dtos/create-user-dto';
import { CreateUserService } from 'src/app/services/create-user.service';

@Controller('api')
export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  @Post('user')
  async handle(@Body() body: CreateUserDTO, @Response() res: IResponse) {
    const { name, email, password } = body;

    await this.createUserService.execute({
      name,
      email,
      password,
    });
    return res.status(200).send();
  }
}
