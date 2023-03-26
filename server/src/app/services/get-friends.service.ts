import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UserRepository } from '../repositories/user-repository';

interface IResponse {
  data: User[];
}

@Injectable()
export class GetFriendsService {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<IResponse> {
    const users = await this.userRepository.findAll();

    const friends = users.filter((friend) => {
      return friend.id !== userId;
    });

    return {
      data: friends.map((friend) => {
        return friend.toHTTP();
      }),
    };
  }
}
