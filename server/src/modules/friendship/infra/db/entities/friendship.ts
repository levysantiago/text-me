import { ICreateFriendshipDTO } from '@modules/friendship/dtos/icreate-friendship-dto';
import { User } from '@modules/user/infra/db/entities/user';
import { Exclude, instanceToPlain } from 'class-transformer';
import { randomUUID } from 'crypto';

export class Friendship {
  constructor(props: ICreateFriendshipDTO, id?: string) {
    this.userId = props.userId;
    this.friendId = props.friendId;
    this.friend = props.friend
      ? new User(props.friend, props.friend.id)
      : undefined;

    this.id = id ?? randomUUID();
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  @Exclude()
  id: string;

  userId: string;

  friendId: string;

  friend?: User;

  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  toHTTP(): Friendship {
    const friend = instanceToPlain(this.friend) as User;
    const friendshipToReturn = instanceToPlain(this) as Friendship;
    return { ...friendshipToReturn, friend } as Friendship;
  }

  friendToHTTP(): User {
    return this.friend.toHTTP();
  }
}
