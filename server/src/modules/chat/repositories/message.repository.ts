import { Message } from '../infra/db/entities/message';

export abstract class MessageRepository {
  abstract findBy(id: string): Promise<Message>;
  abstract findByConversation(conversation: string): Promise<Message[]>;
  abstract visualizeMessages(
    fromUserId: string,
    toUserId: string,
  ): Promise<void>;
  abstract create(message: Message): Promise<void>;
  abstract save(message: Message): Promise<void>;
  abstract findAllOfUser(userReceiverId: string): Promise<Message[]>;
}
