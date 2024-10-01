import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { User } from '../infra/db/entities/user';
import { UserNotFoundError } from '../errors/user-not-found.error';

interface IRequest {
  userId: string;
}

@Injectable()
export class GetUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ userId }: IRequest): Promise<User> {
    // Find user
    const user = await this.userRepository.find(userId);
    if (!user) throw new UserNotFoundError();

    // Return user found
    return user.toHTTP();
  }
}
