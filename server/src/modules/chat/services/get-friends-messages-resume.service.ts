import { MessageRepository } from '@modules/chat/repositories/message.repository';
import { FriendshipRepository } from '@modules/friendship/repositories/friendship.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

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
    private friendshipRepository: FriendshipRepository,
  ) {}

  async execute({ toUserId }: IRequest): Promise<IResponse> {
    try {
      const messages = await this.messageRepository.findAllOfUser(toUserId);

      const friendships = await this.friendshipRepository.findAllOfUser(
        toUserId,
      );

      const data = {};
      friendships.map((friendship) => {
        const friendMessages = messages.filter((m) => {
          return m.fromUserId === friendship.friendId;
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
        data[friendship.friendId] = resume;
      });

      return { data };
    } catch (e) {
      console.log(e);

      throw new HttpException('MESSAGES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
