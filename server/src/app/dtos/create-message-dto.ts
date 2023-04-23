import { IsNotEmpty } from 'class-validator';
import { ICreateMessageDTO } from './icreate-message-dto';

export class CreateMessageDTO implements ICreateMessageDTO {
  @IsNotEmpty()
  fromUserId: string;

  @IsNotEmpty()
  toUserId: string;

  @IsNotEmpty()
  content: string;
}
