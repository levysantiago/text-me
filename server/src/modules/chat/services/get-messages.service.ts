import { Injectable } from '@nestjs/common';
import { MessagesRepository } from '../repositories/messages.repository';
import { ConversationHelper } from '@shared/resources/lib/conversation-helper';
import { MessagesNotFoundError } from '../errors/messages-not-found.error';

interface IMessage {
  fromUserId: string;
  toUserId: string;
  content: string;
}

interface IRequest {
  fromUserId: string;
  toUserId: string;
}

interface IResponse {
  data: IMessage[];
}

@Injectable()
export class GetMessagesService {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute({ fromUserId, toUserId }: IRequest): Promise<IResponse> {
    try {
      // Get users conversation key
      const conversation = ConversationHelper.getConversationFromUsers({
        fromUserId,
        toUserId,
      });
      // find messages by conversation
      const messages = await this.messagesRepository.findByConversation(
        conversation,
      );
      return { data: messages };
    } catch (err) {
      throw new MessagesNotFoundError();
    }
  }
}
