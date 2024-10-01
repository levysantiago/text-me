import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { IUpdateUserDTO } from '../dtos/iupdate-user-dto';
import { UserNotFoundError } from '../errors/user-not-found.error';

interface IRequest extends IUpdateUserDTO {
  id: string;
}

@Injectable()
export class UpdateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id, name, password }: IRequest): Promise<void> {
    // Find user
    const user = await this.usersRepository.find(id);
    if (!user) throw new UserNotFoundError();

    // Update user data
    name ? (user.name = name) : null;
    password ? (user.password = password) : null;

    // Save user updates
    await this.usersRepository.save(user);
  }
}
