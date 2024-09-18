import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';

interface IRequest {
  fromUserId: string;
  userId: string;
}

@Injectable()
export class VisualizeMessagesService {
  constructor(private messageRepository: MessageRepository) {}

  async execute({ fromUserId, userId }: IRequest): Promise<void> {
    try {
      await this.messageRepository.visualizeMessages(fromUserId, userId);
    } catch (e) {
      console.log(e);

      throw new HttpException('MESSAGE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
