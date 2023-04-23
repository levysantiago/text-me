import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessageRepository } from '../repositories/message-repository';
import { UserRepository } from '../repositories/user-repository';

interface IRequest {
  toUserId: string;
}

interface IResume {
  unseenMessages: number;
  lastMessage: string;
}

interface IResponseData {
  [x: string]: IResume;
}

interface IResponse {
  data: IResponseData;
}

@Injectable()
export class GetFriendsMessagesResumeService {
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
        const friendMessages = messages.filter((m) => {
          return m.fromUserId === friend.id;
        });
        const unseenMessages = friendMessages.filter((m) => {
          return !m.visualized;
        });

        const resume: IResume = {
          unseenMessages: unseenMessages.length,
          lastMessage: friendMessages[friendMessages.length - 1]
            ? friendMessages[friendMessages.length - 1].content
            : '',
        };
        data[friend.id] = resume;
      });

      return { data };
    } catch (e) {
      console.log(e);

      throw new HttpException('MESSAGES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
