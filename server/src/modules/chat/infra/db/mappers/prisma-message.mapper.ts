import { Message as RawMessage } from '@prisma/client';
import { Message } from '../entities/message';

export class PrismaMessageMapper {
  static toPrisma(message: Message): RawMessage {
    return message;
  }

  static fromPrisma(rawMessage: RawMessage) {
    return new Message(rawMessage, rawMessage.id);
  }
}
