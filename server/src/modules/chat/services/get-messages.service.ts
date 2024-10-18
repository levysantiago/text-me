import { Injectable } from '@nestjs/common';
import { MessagesRepository } from '../repositories/messages.repository';
import { ConversationHelper } from '@shared/resources/lib/conversation-helper';
import { MessagesNotFoundError } from '../errors/messages-not-found.error';
import { GetMessagesResponseDTO } from './dtos/get-messages-response-dto';

interface IRequest {
  fromUserId: string;
  toUserId: string;
}

@Injectable()
export class GetMessagesService {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute({
    fromUserId,
    toUserId,
  }: IRequest): Promise<GetMessagesResponseDTO> {
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

      // messages to return
      const messagesToReturn = messages.map((msg) => msg.toHTTP());

      return { data: messagesToReturn };
    } catch (err) {
      throw new MessagesNotFoundError();
    }
  }
}
