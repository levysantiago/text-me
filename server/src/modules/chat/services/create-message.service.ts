import { Injectable } from '@nestjs/common';
import { IRole } from '@shared/resources/types/irole';
import { MessagesRepository } from '../repositories/messages.repository';
import { Message } from '../infra/db/entities/message';

interface IRequest {
  fromUserId: string;
  toUserId: string;
  content: string;
  role: IRole;
}

@Injectable()
export class CreateMessageService {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute({
    fromUserId,
    toUserId,
    content,
    role,
  }: IRequest): Promise<void> {
    // Create message entity
    const message = new Message({
      fromUserId,
      toUserId,
      content,
      role,
    });

    // Persist message
    await this.messagesRepository.create(message);
  }
}
