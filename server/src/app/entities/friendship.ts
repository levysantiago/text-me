import { Exclude, instanceToPlain } from 'class-transformer';
import { ICreateFriendshipDTO } from '../dtos/icreate-friendship-dto';
import { randomUUID } from 'crypto';

export class Friendship {
  constructor(props: ICreateFriendshipDTO, id?: string) {
    this.userId = props.userId;
    this.friendId = props.friendId;

    this.id = id ?? randomUUID();
    this.created_at = props.created_at ?? new Date();
    this.updated_at = props.updated_at ?? new Date();
  }

  @Exclude()
  id: string;

  userId: string;

  friendId: string;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;

  toHTTP(): Friendship {
    return instanceToPlain(this) as Friendship;
  }
}
