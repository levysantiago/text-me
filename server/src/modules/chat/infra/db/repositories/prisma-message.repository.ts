import { MessageRepository } from '@modules/chat/repositories/message.repository';
import { Message } from '../entities/message';
import { Injectable } from '@nestjs/common';
import { PrismaDatabaseProvider } from '@shared/container/providers/database-provider/implementations/prisma-database.provider';
import { PrismaMessageMapper } from '../mappers/prisma-message.mapper';

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
  constructor(private prismaService: PrismaDatabaseProvider) {}

  async create(message: Message): Promise<void> {
    await this.prismaService.message.create({ data: message });
  }

  async findBy(id: string): Promise<Message> {
    const rawMessage = await this.prismaService.message.findUnique({
      where: { id },
    });
    return PrismaMessageMapper.fromPrisma(rawMessage);
  }

  async findAllOfUser(userReceiverId: string): Promise<Message[]> {
    const rawMessages = await this.prismaService.message.findMany({
      where: { toUserId: userReceiverId },
    });
    return rawMessages.map(PrismaMessageMapper.fromPrisma);
  }

  async findByConversation(conversation: string): Promise<Message[]> {
    const rawMessages = await this.prismaService.message.findMany({
      where: { conversation: conversation },
    });
    return rawMessages.map(PrismaMessageMapper.fromPrisma);
  }

  async visualizeMessages(fromUserId: string, toUserId: string): Promise<void> {
    await this.prismaService.message.updateMany({
      where: { fromUserId, toUserId },
      data: { visualized: true },
    });
  }

  async save(message: Message): Promise<void> {
    const raw = PrismaMessageMapper.toPrisma(message);
    await this.prismaService.message.update({
      where: { id: raw.id },
      data: raw,
    });
  }
}