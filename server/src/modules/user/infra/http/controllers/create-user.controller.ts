import { CreateUserService } from '@modules/user/services/create-user.service';
import { Body, Controller, Post, Response } from '@nestjs/common';
import { Response as IResponse } from 'express';

@Controller('api')
export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  @Post('user')
  async handle(@Body() body: any, @Response() res: IResponse) {
    const { name, email, password } = body;

    await this.createUserService.execute({
      name,
      email,
      password,
    });
    return res.status(200).send();
  }
}
