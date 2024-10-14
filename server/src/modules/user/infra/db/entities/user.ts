import { ICreateUserDTO } from '@modules/user/services/dtos/icreate-user-dto';
import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({example: "01928cb8-953c-7114-9b48-e2478a5d7c53"})
  id: string;

  @ApiProperty({example: "john@gmail.com"})
  email: string;

  @ApiProperty({example: "John"})
  name: string;

  @ApiProperty({example: false})
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
