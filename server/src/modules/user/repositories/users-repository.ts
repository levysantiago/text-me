import { User } from '../infra/db/entities/user';

export abstract class UsersRepository {
  abstract find(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: User): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract save(user: User): Promise<User>;
}
