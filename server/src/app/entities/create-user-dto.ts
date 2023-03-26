import { IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}
