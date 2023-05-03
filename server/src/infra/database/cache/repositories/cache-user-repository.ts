import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/app/entities/user';
import { UserRepository } from 'src/app/repositories/user-repository';

export class CacheUserRepository implements UserRepository {
  private cache: User[] = [];

  constructor() {
    const user = new User(
      {
        email: 'john@gmail.com',
        name: 'John',
        password: '123',
      },
      '6c02ce1a-8caf-4e6e-8850-a4bd6c69fce6',
    );

    const user2 = new User(
      {
        email: 'mary@gmail.com',
        name: 'Mary',
        password: '123',
      },
      '7c02ce1a-8caf-4e6e-8850-a4bd6c69fce6',
    );

    this.cache.push(user);
    this.cache.push(user2);
  }

  findAll(): Promise<User[]> {
    return new Promise((resolve) => {
      resolve(this.cache);
    });
  }

  create(user: User): Promise<void> {
    return new Promise((resolve) => {
      this.cache.push(user);
      resolve();
    });
  }

  find(id: string): Promise<User | null> {
    return new Promise((resolve) => {
      const user = this.cache.filter((_user) => {
        return _user.id === id;
      });

      if (!user.length) {
        resolve(null);
      }

      resolve(user[0]);
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const user = this.cache.filter((_user) => {
        return _user.email === email;
      });

      if (!user.length) {
        resolve(null);
      }

      resolve(user[0]);
    });
  }

  save(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      let userToUpdate = this.cache.filter((_user) => {
        return _user.id === user.id;
      })[0];
      if (!userToUpdate) {
        reject(new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND));
      }
      userToUpdate = user;

      resolve();
    });
  }
}
