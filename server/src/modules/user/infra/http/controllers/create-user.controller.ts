import { CreateUserService } from '@modules/user/services/create-user.service';
import { CreateUserResponseDTO } from '@modules/user/services/dtos/create-user-response-dto';
import { Body, Controller, Post, Response, UsePipes } from '@nestjs/common';
import {  ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppErrorDTO } from '@shared/resources/errors/dtos/app-error-dto';
import { AppValidationErrorDTO } from '@shared/resources/errors/dtos/app-validation-error-dto';
import { Response as IResponse } from 'express';
import { CreateUserBodyDTO, CreateUserValidationPipe } from './validations/create-user-validation.pipe';


@Controller('api')
@ApiTags("User")
export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  @Post('user')
  @UsePipes(CreateUserValidationPipe)
  @ApiCreatedResponse({
    type: CreateUserResponseDTO
  })
  @ApiResponse({
    type: AppErrorDTO,
    status: 500
  })
  @ApiResponse({
    type: AppValidationErrorDTO,
    status:400
  })
  async handle(@Body() body: CreateUserBodyDTO, @Response() res: IResponse): Promise<IResponse<CreateUserResponseDTO>> {
    const { name, email, password } = body;

    const data: any = await this.createUserService.execute({
      name,
      email,
      password,
    });
    return res.status(201).json(data);
  }
}
