import { Injectable } from '@nestjs/common';
import { Friendship } from '../infra/db/entities/friendship';
import { FriendshipsRepository } from '../repositories/friendships.repository';
import { FriendNotFoundError } from '../errors/friend-not-found.error';
import { UsersRepository } from '@modules/user/repositories/users-repository';

interface IRequest {
  userId: string;
  friendEmail: string;
}

@Injectable()
export class AddFriendService {
  constructor(
    private friendshipsRepository: FriendshipsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ userId, friendEmail }: IRequest): Promise<void> {
    // Find friend
    const friend = await this.usersRepository.findByEmail(friendEmail);
    if (!friend) throw new FriendNotFoundError();

    // Create friendship entity
    const friendship = new Friendship({ userId, friendId: friend.id });

    // Persist friendship
    await this.friendshipsRepository.create(friendship);
  }
}
