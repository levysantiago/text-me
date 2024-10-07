import { Injectable } from '@nestjs/common';
import { IRole } from '@shared/resources/types/irole';
import { MessagesRepository } from '../repositories/messages.repository';
import { Message } from '../infra/db/entities/message';
import { UsersRepository } from '@modules/user/repositories/users-repository';
import { FriendNotFoundError } from '@modules/friendship/errors/friend-not-found.error';

interface IRequest {
  fromUserId: string;
  toUserId: string;
  content: string;
  role: IRole;
}

@Injectable()
export class CreateMessageService {
  constructor(
    private messagesRepository: MessagesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    fromUserId,
    toUserId,
    content,
    role,
  }: IRequest): Promise<void> {
    // Verify friend
    const friendUser = await this.usersRepository.find(toUserId);
    if (!friendUser) throw new FriendNotFoundError();

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
