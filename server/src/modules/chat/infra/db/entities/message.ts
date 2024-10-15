import { Exclude, instanceToPlain } from 'class-transformer';
import { randomUUID } from 'node:crypto';
import { IRole } from '@shared/resources/types/irole';
import { ICreateMessageDTO } from '@modules/chat/dtos/icreate-message-dto';
import { ConversationHelper } from '@shared/resources/lib/conversation-helper';
import { ApiProperty } from '@nestjs/swagger';

export class Message {
  constructor(props: ICreateMessageDTO, id?: string) {
    this.fromUserId = props.fromUserId;
    this.toUserId = props.toUserId;
    this.content = props.content;
    this.visualized = props.visualized ?? false;
    this.role = props.role;
    this.conversation = ConversationHelper.getConversationFromUsers({
      fromUserId: this.fromUserId,
      toUserId: this.toUserId,
    });

    this.id = id ?? randomUUID();
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  @Exclude()
  id: string;

  @ApiProperty({
    description: 'ID of the message sender user.',
  })
  fromUserId: string;

  @ApiProperty({
    description: 'ID of the message receiver user.',
  })
  toUserId: string;

  @ApiProperty({
    description: 'Role to define if user is an AI assistant or not.',
    enum: ['user', 'assistant'],
  })
  role: IRole;

  @ApiProperty({
    description:
      'A unique identification of the conversation between two users.',
  })
  conversation: string;

  @ApiProperty({
    description: 'If the message was visualized or not.',
  })
  visualized: boolean;

  @ApiProperty({
    description: 'The content of the message.',
  })
  content: string;

  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  toHTTP(): Message {
    return instanceToPlain(this) as Message;
  }
}
