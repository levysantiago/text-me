import { User } from 'src/app/entities/user';
import { User as RawUser } from '@prisma/client';

export class PrismaUserMapper {
  static toPrisma(user: User) {
    return user;
  }

  static fromPrisma(rawUser: RawUser) {
    return new User(rawUser, rawUser.id);
  }
}
