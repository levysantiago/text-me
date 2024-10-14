import { CreateUserService } from '@modules/user/services/create-user.service';
import { Body, Controller, Post, Response, UsePipes } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { CreateUserValidationPipe, ICreateUserBody } from './validations/create-user-validation.pipe';

@Controller('api')
export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  @Post('user')
  @UsePipes(CreateUserValidationPipe)
  async handle(@Body() body: ICreateUserBody, @Response() res: IResponse) {
    const { name, email, password } = body;

    const data = await this.createUserService.execute({
      name,
      email,
      password,
    });
    return res.status(201).json(data);
  }
}
