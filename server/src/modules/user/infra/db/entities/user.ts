import { ICreateUserDTO } from '@modules/user/dtos/icreate-user-dto';
import { Exclude, instanceToPlain } from 'class-transformer';
import { randomUUID } from 'crypto';

export class User {
  constructor(props: ICreateUserDTO, id?: string) {
    this.email = props.email;
    this.name = props.name;
    this.password = props.password;
    this.isAssistant = props.isAssistant || false;

    this.id = id ?? randomUUID();
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  id: string;

  email: string;

  name: string;

  isAssistant: boolean;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  toHTTP(): User {
    return instanceToPlain(this) as User;
  }
}
