import { Exclude, instanceToPlain } from 'class-transformer';
import { randomUUID } from 'crypto';

interface ICreateUserDTO {
  email: string;
  password: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export class User {
  constructor(props: ICreateUserDTO, id?: string) {
    this.email = props.email;
    this.name = props.name;
    this.password = props.password;

    this.id = id ?? randomUUID();
    this.created_at = props.created_at ?? new Date();
    this.updated_at = props.updated_at ?? new Date();
  }

  @Exclude()
  id: string;

  email: string;

  name: string;

  password: string;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;

  toHTTP(): User {
    return instanceToPlain(this) as User;
  }
}
