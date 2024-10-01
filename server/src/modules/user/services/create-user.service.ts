import { Injectable } from '@nestjs/common';
import { User } from '../infra/db/entities/user';
import { UserRepository } from '../repositories/user-repository';
import { ICreateUserDTO } from '../dtos/icreate-user-dto';
import { EmailAlreadyExistsError } from '../errors/email-already-exists.error';

type IRequest = ICreateUserDTO;

@Injectable()
export class CreateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, name, password }: IRequest): Promise<void> {
    // Create user entity
    const user = new User({
      email,
      name,
      password,
    });

    // Verify if user with same email exists
    const userWithSameEmail = await this.userRepository.findByEmail(email);
    if (userWithSameEmail) throw new EmailAlreadyExistsError();

    // Persisting user
    await this.userRepository.create(user);
  }
}
