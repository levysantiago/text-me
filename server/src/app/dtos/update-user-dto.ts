import { IsEmpty } from 'class-validator';
import { IUpdateUserDTO } from './iupdate-user-dto';

export class UpdateUserDTO implements IUpdateUserDTO {
  @IsEmpty()
  name: string;

  @IsEmpty()
  password: string;
}
