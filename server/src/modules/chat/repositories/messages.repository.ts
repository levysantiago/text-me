import { Message } from '../infra/db/entities/message';

export abstract class MessagesRepository {
  abstract findById(id: string): Promise<Message>;
  abstract findByConversation(conversation: string): Promise<Message[]>;
  abstract visualizeMessages(
    fromUserId: string,
    toUserId: string,
  ): Promise<void>;
  abstract create(message: Message): Promise<void>;
  abstract save(message: Message): Promise<void>;
  abstract findAllOfUser(userReceiverId: string): Promise<Message[]>;
}
