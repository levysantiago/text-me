import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';

interface IRequest {
  fromUserId: string;
  userId: string;
}

@Injectable()
export class VisualizeMessagesService {
  constructor(private messageRepository: MessageRepository) {}

  async execute({ fromUserId, userId }: IRequest): Promise<void> {
    // Update messages as visualized
    await this.messageRepository.visualizeMessages(fromUserId, userId);
  }
}
