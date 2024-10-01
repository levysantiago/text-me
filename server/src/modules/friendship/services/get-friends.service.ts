import { Injectable } from '@nestjs/common';
import { FriendshipRepository } from '../repositories/friendship.repository';
import { User } from '@modules/user/infra/db/entities/user';

interface IResponse {
  data: User[];
}

@Injectable()
export class GetFriendsService {
  constructor(private friendshipRepository: FriendshipRepository) {}

  async execute(userId: string): Promise<IResponse> {
    // Find all friendship of user
    const friendships = await this.friendshipRepository.findAllOfUser(userId);

    // Format user friendship items
    const friends = friendships.map((friendship) => {
      return friendship.friendToHTTP();
    });

    // return friendship
    return {
      data: friends,
    };
  }
}
