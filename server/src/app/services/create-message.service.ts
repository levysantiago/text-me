import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../repositories/message-repository';
import { Message } from '../entities/message';

interface IRequest {
  fromUserId: string;
  toUserId: string;
  content: string;
}

@Injectable()
export class CreateMessageService {
  constructor(private messageRepository: MessageRepository) {}

  async execute({ fromUserId, toUserId, content }: IRequest): Promise<void> {
    const message = new Message({
      fromUserId,
      toUserId,
      content,
    });

    await this.messageRepository.create(message);
  }
}
