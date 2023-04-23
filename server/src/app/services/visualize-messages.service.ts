import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessageRepository } from '../repositories/message-repository';
import { getConversationFromUsers } from 'src/lib/get-conversation-from-users-helper';

interface IRequest {
  fromUserId: string;
  toUserId: string;
}

@Injectable()
export class VisualizeMessagesService {
  constructor(private messageRepository: MessageRepository) {}

  async execute({ fromUserId, toUserId }: IRequest): Promise<void> {
    try {
      const conversationId = getConversationFromUsers({ fromUserId, toUserId });

      const messages = await this.messageRepository.findByConversation(
        conversationId,
      );

      await Promise.all(
        messages.map(async (m) => {
          await this.messageRepository.save(m.id, { visualized: true });
        }),
      );
    } catch (e) {
      throw new HttpException('MESSAGE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
