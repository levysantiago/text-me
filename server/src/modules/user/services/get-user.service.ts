import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { User } from '../infra/db/entities/user';
import { UserNotFoundError } from '../errors/user-not-found.error';

interface IRequest {
  userId: string;
}

@Injectable()
export class GetUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: IRequest): Promise<User> {
    // Find user
    const user = await this.usersRepository.find(userId);
    if (!user) throw new UserNotFoundError();

    // Return user found
    return user.toHTTP();
  }
}
