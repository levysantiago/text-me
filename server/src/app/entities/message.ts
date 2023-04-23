import { Exclude, instanceToPlain } from 'class-transformer';
import { randomUUID } from 'node:crypto';
import { getConversationFromUsers } from 'src/lib/get-conversation-from-users-helper';
import { ICreateMessageDTO } from '../dtos/icreate-message-dto';

export class Message {
  constructor(props: ICreateMessageDTO, id?: string) {
    this.fromUserId = props.fromUserId;
    this.toUserId = props.toUserId;
    this.content = props.content;
    this.visualized = false;
    this.conversation = getConversationFromUsers({
      fromUserId: this.fromUserId,
      toUserId: this.toUserId,
    });

    this.id = id ?? randomUUID();
    this.created_at = props.created_at ?? new Date();
    this.updated_at = props.updated_at ?? new Date();
  }

  @Exclude()
  id: string;

  fromUserId: string;

  toUserId: string;

  conversation: string;

  visualized: boolean;

  content: string;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;

  toHTTP(): Message {
    return instanceToPlain(this) as Message;
  }
}
