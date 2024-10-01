import { FriendshipRepository } from '@modules/friendship/repositories/friendship.repository';
import { Injectable } from '@nestjs/common';
import { PrismaDatabaseProvider } from '@shared/container/providers/database-provider/implementations/prisma-database.provider';
import { Friendship } from '../entities/friendship';
import { PrismaFriendshipMapper } from '../mappers/prisma-friendship.mapper';

@Injectable()
export class PrismaFriendshipRepository implements FriendshipRepository {
  constructor(private prismaService: PrismaDatabaseProvider) {}

  async create(friendship: Friendship): Promise<void> {
    await this.prismaService.friendship.create({
      data: PrismaFriendshipMapper.toPrisma(friendship),
    });
  }

  async findAllOfUser(userId: string): Promise<Friendship[]> {
    const rawFriendships = await this.prismaService.friendship.findMany({
      where: { userId },
      include: {
        friend: true,
      },
    });
    return rawFriendships.map(PrismaFriendshipMapper.fromPrisma);
  }

  async findByUsers(
    userId: string,
    friendId: string,
  ): Promise<Friendship | null> {
    const rawFriendship = await this.prismaService.friendship.findFirst({
      where: { userId, friendId },
    });
    if (!rawFriendship) return null;
    return PrismaFriendshipMapper.fromPrisma(rawFriendship);
  }

  async delete(userId: string, friendId: string): Promise<void> {
    await this.prismaService.friendship.deleteMany({
      where: { userId, friendId },
    });
  }
}
