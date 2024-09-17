import { Exclude, instanceToPlain } from 'class-transformer';
import { ICreateFriendshipDTO } from '../dtos/icreate-friendship-dto';
import { randomUUID } from 'crypto';

export class Friendship {
  constructor(props: ICreateFriendshipDTO, id?: string) {
    this.userId = props.userId;
    this.friendId = props.friendId;

    this.id = id ?? randomUUID();
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  @Exclude()
  id: string;

  userId: string;

  friendId: string;

  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  toHTTP(): Friendship {
    return instanceToPlain(this) as Friendship;
  }
}
