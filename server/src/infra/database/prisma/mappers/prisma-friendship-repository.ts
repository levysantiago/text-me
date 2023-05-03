import { Friendship } from 'src/app/entities/friendship';
import { Friendship as RawFriendship } from '@prisma/client';

export class PrismaFriendshipMapper {
  static toPrisma(friendship: Friendship) {
    return friendship;
  }

  static fromPrisma(rawFriendship: RawFriendship) {
    return new Friendship(rawFriendship, rawFriendship.id);
  }
}
