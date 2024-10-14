import { User } from "@modules/user/infra/db/entities/user";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserResponseDTO{
  @ApiProperty()
  user: User
}