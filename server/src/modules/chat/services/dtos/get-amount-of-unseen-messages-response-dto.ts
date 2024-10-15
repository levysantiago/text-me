import { ApiProperty } from "@nestjs/swagger";

export class GetAmountOfUnseenMessagesResponseDTO{
  @ApiProperty({
    example: {
      "01929169-313a-7aaa-872f-33e433f16220": {
        unseenMessages: 4,
        lastMessage: "Hello John! How are you?"
      },
      "01929169-d8a5-700c-83d4-74d8136c2b2e": {
        unseenMessages: 11,
        lastMessage: "John? Are you there?"
      }
    }
  })
  data: {
    [x:string]: {
      unseenMessages: number;
      lastMessage: string;
    }
  }
}