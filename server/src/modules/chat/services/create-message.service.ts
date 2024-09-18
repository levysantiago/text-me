import { Injectable } from '@nestjs/common';
import { IRole } from '@shared/resources/types/irole';
import { MessageRepository } from '../repositories/message.repository';
import { Message } from '../infra/db/entities/message';

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
