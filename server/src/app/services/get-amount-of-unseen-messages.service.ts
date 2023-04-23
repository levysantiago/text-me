import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessageRepository } from '../repositories/message-repository';
import { UserRepository } from '../repositories/user-repository';

interface IRequest {
  toUserId: string;
}

interface IResponseData {
  [x: string]: number;
}

interface IResponse {
  data: IResponseData;
}

@Injectable()
export class GetAmountOfUnseenMessagesService {
  constructor(
    private messageRepository: MessageRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({ toUserId }: IRequest): Promise<IResponse> {
    try {
      const messages = await this.messageRepository.findAllOfUser(toUserId);

      const users = await this.userRepository.findAll();

      const friends = users.filter((friend) => {
        return friend.id !== toUserId;
      });

      const data = {};
      friends.map((friend) => {
        const unseenMessages = messages.filter((m) => {
          return m.fromUserId === friend.id && !m.visualized;
        });
        data[friend.id] = unseenMessages.length;
      });

      return { data };
    } catch (e) {
      throw new HttpException('MESSAGES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
