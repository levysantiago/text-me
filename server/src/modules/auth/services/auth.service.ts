import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidEmailOrPasswordError } from '../error/invalid-email-or-password.error';
import { UsersRepository } from '@modules/user/repositories/users-repository';
import { AuthResponseDTO } from './dtos/auth-response-dto';

interface IRequest {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async execute({ email, password }: IRequest): Promise<AuthResponseDTO> {
    // Find user by email
    const user = await this.usersRepository.findByEmail(email);

    // Verify user and password
    if (user && user.password === password) {
      // Create payload
      const payload = { username: user.name, sub: user.id };

      // Sign and create access token
      const accessToken = this.jwtService.sign(payload);

      // Return access token
      return { data:{ access_token: accessToken } };
    }

    throw new InvalidEmailOrPasswordError();
  }
}
