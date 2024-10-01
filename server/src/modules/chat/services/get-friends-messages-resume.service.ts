import { MessageRepository } from '@modules/chat/repositories/message.repository';
import { FriendshipsRepository } from '@modules/friendship/repositories/friendships.repository';
import { Injectable } from '@nestjs/common';
import { MessagesNotFoundError } from '../errors/messages-not-found.error';

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
    private friendshipsRepository: FriendshipsRepository,
  ) {}

  async execute({ toUserId }: IRequest): Promise<IResponse> {
    try {
      // Find all user messages
      const messages = await this.messageRepository.findAllOfUser(toUserId);

      // Find all user friendships
      const friendships = await this.friendshipsRepository.findAllOfUser(
        toUserId,
      );

      // Initialize data to be returned
      const data = {};
      friendships.map((friendship) => {
        // Filter only messages of each specific friend
        const friendMessages = messages.filter((m) => {
          return m.fromUserId === friendship.friendId;
        });

        // Check for unseen messages
        const unseenMessages = friendMessages.filter((m) => {
          return !m.visualized;
        });

        // Prepare resume of friend messages
        const resume: IResume = {
          // Amount of unseen messages
          unseenMessages: unseenMessages.length,
          // Last message sent by the friend
          lastMessage: friendMessages[friendMessages.length - 1]
            ? friendMessages[friendMessages.length - 1].content
            : '',
        };
        // Assign resumes to each friend key in data object
        data[friendship.friendId] = resume;
      });

      return { data };
    } catch (err) {
      console.log(err);
      throw new MessagesNotFoundError();
    }
  }
}
