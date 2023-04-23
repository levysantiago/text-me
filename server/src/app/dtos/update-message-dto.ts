import { IsEmpty } from 'class-validator';
import { IUpdateMessageDTO } from './iupdate-message-dto';

export class UpdateMessageDTO implements IUpdateMessageDTO {
  @IsEmpty()
  visualized?: boolean;

  @IsEmpty()
  content?: string;
}
