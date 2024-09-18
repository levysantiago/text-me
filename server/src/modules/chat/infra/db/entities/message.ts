import { Exclude, instanceToPlain } from 'class-transformer';
import { randomUUID } from 'node:crypto';
import { IRole } from '@shared/resources/types/irole';
import { getConversationFromUsers } from '@shared/resources/lib/get-conversation-from-users-helper';
import { ICreateMessageDTO } from '@modules/chat/dtos/icreate-message-dto';

export class Message {
  constructor(props: ICreateMessageDTO, id?: string) {
    this.fromUserId = props.fromUserId;
    this.toUserId = props.toUserId;
    this.content = props.content;
    this.visualized = props.visualized ?? false;
    this.role = props.role;
    this.conversation = getConversationFromUsers({
      fromUserId: this.fromUserId,
      toUserId: this.toUserId,
    });

    this.id = id ?? randomUUID();
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  @Exclude()
  id: string;

  fromUserId: string;

  toUserId: string;

  role: IRole;

  conversation: string;

  visualized: boolean;

  content: string;

  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  toHTTP(): Message {
    return instanceToPlain(this) as Message;
  }
}
