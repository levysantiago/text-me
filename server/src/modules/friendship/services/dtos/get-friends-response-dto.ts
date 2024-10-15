import { User } from "@modules/user/infra/db/entities/user";
import { ApiProperty } from "@nestjs/swagger";

export class GetFriensResponseDTO{
  @ApiProperty({
    example: [
      {
        "id": "01928cb8-953c-7114-9b48-e2478a5d7c53",
        "email": "bob@gmail.com",
        "name": "Bob",
        "isAssistant": false
      },
      {
        "id": "01929097-2bee-7666-8520-7b8b4cb01356",
        "email": "alice@gmail.com",
        "name": "Alice",
        "isAssistant": false
      }
    ],
    type: User, 
    isArray: true
  })
  data: User[]
}