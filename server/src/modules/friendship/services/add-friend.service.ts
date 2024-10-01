import { Injectable } from '@nestjs/common';
import { Friendship } from '../infra/db/entities/friendship';
import { FriendshipRepository } from '../repositories/friendship.repository';
import { UserRepository } from '@modules/user/repositories/user-repository';
import { FriendNotFoundError } from '../errors/friend-not-found.error';

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
    // Find friend
    const friend = await this.userRepository.findByEmail(friendEmail);
    if (!friend) throw new FriendNotFoundError();

    // Create friendship entity
    const friendship = new Friendship({ userId, friendId: friend.id });

    // Persist friendship
    await this.friendshipRepository.create(friendship);
  }
}
