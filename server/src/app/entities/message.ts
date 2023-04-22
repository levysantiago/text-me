import { Exclude, instanceToPlain } from 'class-transformer';
import { randomUUID } from 'crypto';

interface ICreateMessageDTO {
  fromUserId: string;
  toUserId: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Message {
  constructor(props: ICreateMessageDTO, id?: string) {
    this.fromUserId = props.fromUserId;
    this.toUserId = props.toUserId;
    this.content = props.content;

    this.id = id ?? randomUUID();
    this.created_at = props.created_at ?? new Date();
    this.updated_at = props.updated_at ?? new Date();
  }

  @Exclude()
  id: string;

  fromUserId: string;

  toUserId: string;

  content: string;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;

  toHTTP(): Message {
    return instanceToPlain(this) as Message;
  }
}
