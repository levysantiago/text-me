import { Friendship as RawFriendship } from '@prisma/client';
import { Friendship } from '../entities/friendship';

export class PrismaFriendshipMapper {
  static toPrisma(friendship: Friendship) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { friend, ...friendshipToPersist } = friendship;
    return friendshipToPersist;
  }

  static fromPrisma(rawFriendship: RawFriendship) {
    return new Friendship(rawFriendship, rawFriendship.id);
  }
}
