import { User } from '@modules/user/infra/db/entities/user';
import { User as RawUser } from '@prisma/client';

export interface ICreateFriendshipDTO {
  userId: string;
  friendId: string;
  friend?: User | RawUser;
  createdAt?: Date;
  updatedAt?: Date;
}
