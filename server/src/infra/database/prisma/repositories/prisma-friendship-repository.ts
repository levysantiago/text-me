import { Friendship } from 'src/app/entities/friendship';
import { FriendshipRepository } from 'src/app/repositories/friendship-repository';
import { PrismaService } from '../prisma.service';
import { PrismaFriendshipMapper } from '../mappers/prisma-friendship-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaFriendshipRepository implements FriendshipRepository {
  constructor(private prismaService: PrismaService) {}

  async create(friendship: Friendship): Promise<void> {
    await this.prismaService.friendship.create({ data: friendship });
  }

  async findAllOfUser(userId: string): Promise<Friendship[]> {
    const rawFriendships = await this.prismaService.friendship.findMany({
      where: { userId },
    });
    return rawFriendships.map(PrismaFriendshipMapper.fromPrisma);
  }

  async findByUsers(
    userId: string,
    friendId: string,
  ): Promise<Friendship | null> {
    const rawFriendship = await this.prismaService.friendship.findUnique({
      where: { userId, friendId },
    });
    if (!rawFriendship) return null;
    return PrismaFriendshipMapper.fromPrisma(rawFriendship);
  }

  async delete(userId: string, friendId: string): Promise<void> {
    await this.prismaService.friendship.delete({ where: { userId, friendId } });
  }
}
