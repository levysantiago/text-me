import { Injectable } from '@nestjs/common';
import { FriendshipRepository } from '../repositories/friendship.repository';
import { UserRepository } from '@modules/user/repositories/user-repository';
import { User } from '@modules/user/infra/db/entities/user';

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
