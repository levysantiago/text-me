import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidEmailOrPasswordError } from '../error/invalid-email-or-password.error';
import { UsersRepository } from '@modules/user/repositories/users-repository';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    // Find user by email
    const user = await this.usersRepository.findByEmail(email);

    // Verify user and password
    if (user && user.password === password) {
      // Create payload
      const payload = { username: user.name, sub: user.id };

      // Sign and create access token
      return new Promise((resolve) => {
        resolve({ access_token: this.jwtService.sign(payload) });
      });
    }

    throw new InvalidEmailOrPasswordError();
  }
}
