import { User } from '@modules/user/infra/db/entities/user';

export interface ICreateFriendshipDTO {
  userId: string;
  friendId: string;
  friend?: User;
  createdAt?: Date;
  updatedAt?: Date;
}
