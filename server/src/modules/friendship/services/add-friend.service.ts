import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Friendship } from '../infra/db/entities/friendship';
import { FriendshipRepository } from '../repositories/friendship.repository';
import { UserRepository } from '@modules/user/repositories/user-repository';

interface IRequest {
  userId: string;
  friendEmail: string;
}

@Injectable()
export class AddFriendService {
  constructor(
    private friendshipRepository: FriendshipRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({ userId, friendEmail }: IRequest): Promise<void> {
    const friend = await this.userRepository.findByEmail(friendEmail);
    if (!friend) {
      throw new HttpException('FRIEND_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const friendship = new Friendship({ userId, friendId: friend.id });
    await this.friendshipRepository.create(friendship);
  }
}
