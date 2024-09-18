import { Message as RawMessage } from '@prisma/client';
import { IRole } from '@shared/resources/types/irole';
import { Message } from '../entities/message';

export class PrismaMessageMapper {
  static toPrisma(message: Message) {
    return message;
  }

  static fromPrisma(rawMessage: RawMessage) {
    const role = rawMessage.role as IRole;
    return new Message({ ...rawMessage, role }, rawMessage.id);
  }
}
