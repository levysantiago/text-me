import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessageRepository } from '../repositories/message-repository';

interface IRequest {
  conversationId: string;
}

@Injectable()
export class VisualizeMessagesService {
  constructor(private messageRepository: MessageRepository) {}

  async execute({ conversationId }: IRequest): Promise<void> {
    try {
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
