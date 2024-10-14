import { Injectable } from '@nestjs/common';
import { User } from '../infra/db/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { ICreateUserDTO } from './dtos/icreate-user-dto';
import { EmailAlreadyExistsError } from '../errors/email-already-exists.error';
import { CreateUserResponseDTO } from './dtos/create-user-response-dto';


@Injectable()
export class CreateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: ICreateUserDTO): Promise<CreateUserResponseDTO> {
    // Create user entity
    const user = new User({
      email,
      name,
      password,
    });

    // Verify if user with same email exists
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) throw new EmailAlreadyExistsError();

    // Persisting user
    const userCreated = await this.usersRepository.create(user);

    return { user: userCreated.toHTTP() };
  }
}
