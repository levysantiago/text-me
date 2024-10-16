import { Injectable } from '@nestjs/common';
import { MessagesRepository } from '../repositories/messages.repository';
import { ConversationHelper } from '@shared/resources/lib/conversation-helper';

interface IRequest {
  fromUserId: string;
  userId: string;
}

@Injectable()
export class VisualizeMessagesService {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute({ fromUserId, userId }: IRequest): Promise<void> {
    // Update messages as visualized
    await this.messagesRepository.visualizeMessages(fromUserId, userId);
  }
}
