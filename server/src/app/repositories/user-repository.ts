import { IUpdateUserDTO } from '../dtos/iupdate-user-dto';
import { User } from '../entities/user';

export abstract class UserRepository {
  abstract find(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
  abstract findAll(): Promise<User[]>;
  abstract save(id: string, data: IUpdateUserDTO): Promise<void>;
}
