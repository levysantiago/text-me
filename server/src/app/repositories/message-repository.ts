import { Message } from '../entities/message';

export abstract class MessageRepository {
  abstract findBy(id: string): Promise<Message>;
  abstract findByUsers(
    fromUserId: string,
    toUserId: string,
  ): Promise<Message[]>;
  abstract create(message: Message): Promise<void>;
}
