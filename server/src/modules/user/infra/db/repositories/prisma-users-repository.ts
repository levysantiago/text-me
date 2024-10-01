import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaDatabaseProvider } from '@shared/container/providers/database-provider/implementations/prisma-database.provider';
import { User } from '../entities/user';
import { UsersRepository } from '@modules/user/repositories/users-repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prismaService: PrismaDatabaseProvider) {}

  async findAll(): Promise<User[]> {
    const rawUsers = await this.prismaService.user.findMany();
    return rawUsers.map(PrismaUserMapper.fromPrisma);
  }

  async create(user: User): Promise<void> {
    await this.prismaService.user.create({ data: user });
  }

  async find(id: string): Promise<User | null> {
    const rawUser = await this.prismaService.user.findUnique({ where: { id } });
    return rawUser ? PrismaUserMapper.fromPrisma(rawUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const rawUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    return rawUser ? PrismaUserMapper.fromPrisma(rawUser) : null;
  }

  async save(user: User): Promise<void> {
    const raw = PrismaUserMapper.toPrisma(user);
    await this.prismaService.user.update({
      data: raw,
      where: { id: raw.id },
    });
  }
}
