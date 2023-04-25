import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendshipDTO } from '../dtos/create-friendship-dto';
import { FriendshipRepository } from '../repositories/friendship-repository';
import { Friendship } from '../entities/friendship';
import { UserRepository } from '../repositories/user-repository';

interface IRequest extends CreateFriendshipDTO {
  userId: string;
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
