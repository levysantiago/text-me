import { UserRepository } from '@modules/user/repositories/user-repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (user && user.password === password) {
      const payload = { username: user.name, sub: user.id };

      return new Promise((resolve) => {
        resolve({ access_token: this.jwtService.sign(payload) });
      });
    }

    throw new HttpException('Email or password wrong', HttpStatus.BAD_REQUEST);
  }
}
