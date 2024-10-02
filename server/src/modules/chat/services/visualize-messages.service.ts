import { Injectable } from '@nestjs/common';
import { MessagesRepository } from '../repositories/messages.repository';
import { getConversationFromUsers } from '@shared/resources/lib/get-conversation-from-users-helper';

interface IRequest {
  fromUserId: string;
  userId: string;
}

@Injectable()
export class VisualizeMessagesService {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute({ fromUserId, userId }: IRequest): Promise<void> {
    const conversation = getConversationFromUsers({
      fromUserId,
      toUserId: userId,
    });

    // Update messages as visualized
    await this.messagesRepository.visualizeMessages(conversation);
  }
}
