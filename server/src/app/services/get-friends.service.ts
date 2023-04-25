import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UserRepository } from '../repositories/user-repository';
import { FriendshipRepository } from '../repositories/friendship-repository';

interface IResponse {
  data: User[];
}

@Injectable()
export class GetFriendsService {
  constructor(
    private userRepository: UserRepository,
    private friendshipRepository: FriendshipRepository,
  ) {}

  async execute(userId: string): Promise<IResponse> {
    const friendships = await this.friendshipRepository.findAllOfUser(userId);

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friend = await this.userRepository.find(friendship.friendId);
        return friend.toHTTP();
      }),
    );

    return {
      data: friends,
    };
  }
}
