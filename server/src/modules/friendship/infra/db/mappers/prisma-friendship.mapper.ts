import { Friendship as RawFriendship } from '@prisma/client';
import { Friendship } from '../entities/friendship';

export class PrismaFriendshipMapper {
  static toPrisma(friendship: Friendship) {
    return friendship;
  }

  static fromPrisma(rawFriendship: RawFriendship) {
    return new Friendship(rawFriendship, rawFriendship.id);
  }
}
