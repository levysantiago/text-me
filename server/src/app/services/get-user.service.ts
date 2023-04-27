import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { User } from '../entities/user';

interface IRequest {
  userId: string;
}

@Injectable()
export class GetUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ userId }: IRequest): Promise<User> {
    const user = await this.userRepository.find(userId);
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return user.toHTTP();
  }
}
