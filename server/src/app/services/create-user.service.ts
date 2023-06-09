import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user-dto';
import { User } from '../entities/user';
import { UserRepository } from '../repositories/user-repository';

type IRequest = CreateUserDTO;

@Injectable()
export class CreateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, name, password }: IRequest): Promise<void> {
    try {
      const user = new User({
        email,
        name,
        password,
      });

      const userWithSameEmail = await this.userRepository.findByEmail(email);
      if (userWithSameEmail) {
        throw new HttpException(
          'EMAIL_ALREADY_EXISTS',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.userRepository.create(user);
    } catch (e) {
      if (e instanceof HttpException) throw e;
      console.log(e);
      throw new HttpException('SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
