import { Message } from '@modules/chat/infra/db/entities/message';
import { ApiProperty } from '@nestjs/swagger';

export class GetMessagesResponseDTO {
  @ApiProperty({
    type: Message,
    isArray: true,
    example: [
      {
        fromUserId: '3288fa32-1c78-42ed-b731-60b400531b24',
        toUserId: '7288fa32-1c78-42ed-b731-60b400531b24',
        content: 'Hello!',
        visualized: true,
        role: 'user',
        conversation: '2a6b2c0036cee4a6e093e4c906bc76aa04a3fb5b',
      },
      {
        fromUserId: '7288fa32-1c78-42ed-b731-60b400531b24',
        toUserId: '3288fa32-1c78-42ed-b731-60b400531b24',
        content: 'Hi! How are you?',
        visualized: true,
        role: 'user',
        conversation: '2a6b2c0036cee4a6e093e4c906bc76aa04a3fb5b',
      },
    ],
  })
  data: Message[];
}
