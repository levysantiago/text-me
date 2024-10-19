import { applyDecorators } from '@nestjs/common';
import { ApiHeaders } from '@nestjs/swagger';

export function ApiGlobalHeaders() {
  return applyDecorators(
    ApiHeaders([{
    name: "Accept-Language",
    enum: ["pt", "en"],
    required: false
  }]),
  );
}