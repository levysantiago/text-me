import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { IUpdateUserDTO } from '../dtos/iupdate-user-dto';

interface IRequest extends IUpdateUserDTO {
  id: string;
}

@Injectable()
export class UpdateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ id, name, password }: IRequest): Promise<void> {
    try {
      const user = await this.userRepository.find(id);
      name ? (user.name = name) : null;
      password ? (user.password = password) : null;
      await this.userRepository.save(user);
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException('SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
