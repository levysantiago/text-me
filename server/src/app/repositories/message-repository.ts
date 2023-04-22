import { Message } from '../entities/message';

export abstract class MessageRepository {
  abstract findBy(id: string): Promise<Message>;
  abstract findByConversation(conversation: string): Promise<Message[]>;
  abstract create(message: Message): Promise<void>;
}
