import { IsNotEmpty } from 'class-validator';
import { ICreateUserDTO } from './icreate-user-dto';

export class CreateUserDTO implements ICreateUserDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}
