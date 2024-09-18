import { User as RawUser } from '@prisma/client';
import { User } from '../entities/user';

export class PrismaUserMapper {
  static toPrisma(user: User) {
    return user;
  }

  static fromPrisma(rawUser: RawUser) {
    return new User(rawUser, rawUser.id);
  }
}
