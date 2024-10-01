import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { IUpdateUserDTO } from '../dtos/iupdate-user-dto';
import { UserNotFoundError } from '../errors/user-not-found.error';

interface IRequest extends IUpdateUserDTO {
  id: string;
}

@Injectable()
export class UpdateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ id, name, password }: IRequest): Promise<void> {
    // Find user
    const user = await this.userRepository.find(id);
    if (!user) throw new UserNotFoundError();

    // Update user data
    name ? (user.name = name) : null;
    password ? (user.password = password) : null;

    // Save user updates
    await this.userRepository.save(user);
  }
}
