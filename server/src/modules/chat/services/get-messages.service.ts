import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConversationFromUsers } from '@shared/resources/lib/get-conversation-from-users-helper';
import { MessageRepository } from '../repositories/message.repository';

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
  constructor(private messageRepository: MessageRepository) {}

  async execute({ fromUserId, toUserId }: IRequest): Promise<IResponse> {
    try {
      const conversation = getConversationFromUsers({ fromUserId, toUserId });

      const messages = await this.messageRepository.findByConversation(
        conversation,
      );
      return { data: messages };
    } catch (e) {
      throw new HttpException('MESSAGES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
