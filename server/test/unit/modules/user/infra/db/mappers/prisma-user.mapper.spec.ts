import { User } from '@modules/user/infra/db/entities/user';
import { User as RawUser } from '@prisma/client';
import { PrismaUserMapper } from '@modules/user/infra/db/mappers/prisma-user.mapper';

describe('PrismaUsersRepository', () => {
  describe('toPrisma', () => {
    it('should be able to transform from User entity to RawUser prisma class', () => {
      // create user entity
      const user = new User({
        email: 'bob@gmail.com',
        name: 'bob',
        password: '12345678',
      });

      const expectedRawUser: RawUser = {
        email: 'bob@gmail.com',
        name: 'bob',
        password: '12345678',
        createdAt: user.createdAt,
        id: user.id,
        isAssistant: user.isAssistant,
        updatedAt: user.updatedAt,
      };

      const rawUser = PrismaUserMapper.toPrisma(user);
      expect(rawUser).toEqual(expectedRawUser);
    });
  });

  describe('fromPrisma', () => {
    it('should be able to transform from RawUser prisma to User entity', () => {
      const rawUser: RawUser = {
        id: 'fake-id',
        email: 'bob@gmail.com',
        name: 'bob',
        password: '12345678',
        isAssistant: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = PrismaUserMapper.fromPrisma(rawUser);
      expect(user).toBeInstanceOf(User);
      expect(user.id).toEqual(rawUser.id);
    });
  });
});
