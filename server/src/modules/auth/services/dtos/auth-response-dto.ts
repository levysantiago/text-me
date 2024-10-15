import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDTO{
  @ApiProperty({
    example: {
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJvYiIsInN1YiI6IjMyODhmYTMyLTFjNzgtNDJlZC1iNzMxLTYwYjQwMDUzMWIyNCIsImlhdCI6MTcyODkxNzE5OCwiZXhwIjoxNzI4OTIwNzk4fQ.IrOXUZHNJiBUQ79I7wGGsDgKDObUgxPJt8YNGtLEQ3U"
    }
  })
  data: {
    access_token: string
  };
}