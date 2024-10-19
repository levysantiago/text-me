import { ApiProperty } from "@nestjs/swagger";
import { IErrorMessages } from "../types/ierror-messages";
import { IValidation } from "../types/ivalidation";

export class AppValidationErrorDTO{
  @ApiProperty({example: 400})
  statusCode: number;
  
  @ApiProperty({
    enum: Object.keys(require('../../../resources/lang/en/errors.json')), 
    example: "VALIDATION_ERROR"
  })
  error: keyof IErrorMessages;
  
  @ApiProperty({example: "Validation error"})
  message: string;

  @ApiProperty({example: [
		{
			"issue": "Password is required",
			"field": "password",
			"validation": "required"
		}
	],})
  details?: IValidation[];

  @ApiProperty({example: "2024-10-14T19:06:52.956Z"})
  timestamp?: string;

  @ApiProperty({example: "api/user"})
  path?: string;
}