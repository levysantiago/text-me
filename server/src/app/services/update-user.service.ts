import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { UpdateUserDTO } from '../dtos/update-user-dto';

interface IRequest extends UpdateUserDTO {
  id: string;
}

@Injectable()
export class UpdateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ id, name, password }: IRequest): Promise<void> {
    try {
      await this.userRepository.save(id, { name, password });
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException('SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
