import { Message } from 'src/app/entities/message';
import { MessageRepository } from 'src/app/repositories/message-repository';
import { PrismaService } from '../prisma.service';
import { PrismaMessageMapper } from '../mappers/prisma-message-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
  constructor(private prismaService: PrismaService) {}

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
