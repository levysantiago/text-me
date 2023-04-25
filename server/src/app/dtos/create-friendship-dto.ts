import { IsNotEmpty } from 'class-validator';

export class CreateFriendshipDTO {
  @IsNotEmpty()
  friendEmail: string;
}
