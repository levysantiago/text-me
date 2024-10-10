import { Friendship } from '@modules/friendship/infra/db/entities/friendship';
import { Friendship as RawFriendship } from '@prisma/client';
import { PrismaFriendshipMapper } from '@modules/friendship/infra/db/mappers/prisma-friendship.mapper';

describe('PrismaFriendshipRepository', () => {
  describe('toPrisma', () => {
    it('should be able to transform from Friendship entity to RawFriendship prisma class', () => {
      const friendship = new Friendship({
        friendId: 'fake-friend-id',
        userId: 'fake-user-id',
      });

      const expectedRawFriendship: RawFriendship = {
        friendId: 'fake-friend-id',
        userId: 'fake-user-id',
        createdAt: friendship.createdAt,
        id: friendship.id,
        updatedAt: friendship.updatedAt,
      };

      const rawFriendship = PrismaFriendshipMapper.toPrisma(friendship);
      expect(rawFriendship).toEqual(expectedRawFriendship);
    });
  });

  describe('fromPrisma', () => {
    it('should be able to transform from RawFriendship prisma to Friendship entity', () => {
      const rawFriendship: RawFriendship = {
        friendId: 'fake-friend-id',
        userId: 'fake-user-id',
        id: 'fake-friendship-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const friendship = PrismaFriendshipMapper.fromPrisma(rawFriendship);
      expect(friendship).toBeInstanceOf(Friendship);
      expect(friendship.id).toEqual(rawFriendship.id);
    });
  });
});
