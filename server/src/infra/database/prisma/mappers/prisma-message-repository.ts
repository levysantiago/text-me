import { Message } from 'src/app/entities/message';
import { Message as RawMessage } from '@prisma/client';

export class PrismaMessageMapper {
  static toPrisma(message: Message) {
    return message;
  }

  static fromPrisma(rawMessage: RawMessage) {
    return new Message(rawMessage, rawMessage.id);
  }
}
