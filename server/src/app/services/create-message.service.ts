import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../repositories/message-repository';
import { Message } from '../entities/message';
import { IRole } from '../entities/types/irole';

interface IRequest {
  fromUserId: string;
  toUserId: string;
  content: string;
  role: IRole;
}

@Injectable()
export class CreateMessageService {
  constructor(private messageRepository: MessageRepository) {}

  async execute({
    fromUserId,
    toUserId,
    content,
    role,
  }: IRequest): Promise<void> {
    const message = new Message({
      fromUserId,
      toUserId,
      content,
      role,
    });

    await this.messageRepository.create(message);
  }
}
