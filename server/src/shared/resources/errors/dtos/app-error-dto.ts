import { ApiProperty } from "@nestjs/swagger";
import { IErrorMessages } from "../types/ierror-messages";

export class AppErrorDTO{
  @ApiProperty({example: 500})
  statusCode: number;
  
  @ApiProperty({
    enum: Object.keys(require('../../../resources/lang/en/errors.json')), 
    example: "INTERNAL_SERVER_ERROR"
  })
  error: keyof IErrorMessages;
  
  @ApiProperty({example: "A unexpected error ocurred, please, await some minutes or contact support."})
  message: string;

  @ApiProperty({example: "Specified reason"})
  reason?: string;

  @ApiProperty({example: "2024-10-14T19:06:52.956Z"})
  timestamp?: string;

  @ApiProperty({example: "api/user"})
  path?: string;
}