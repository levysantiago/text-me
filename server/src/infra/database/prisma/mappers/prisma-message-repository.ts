import { Message } from 'src/app/entities/message';
import { Message as RawMessage } from '@prisma/client';
import { IRole } from 'src/app/entities/types/irole';

export class PrismaMessageMapper {
  static toPrisma(message: Message) {
    return message;
  }

  static fromPrisma(rawMessage: RawMessage) {
    const role = rawMessage.role as IRole;
    return new Message({ ...rawMessage, role }, rawMessage.id);
  }
}
