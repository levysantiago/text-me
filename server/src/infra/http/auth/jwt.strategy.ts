import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/app/repositories/user-repository';
import { env } from 'src/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findBy(payload.sub);
    if (!user) return null;

    return { userId: payload.sub, username: payload.username };
  }
}
