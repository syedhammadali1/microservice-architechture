import { IsEmail, IsISO8601, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateBookingDto {
  // In step 5 (API Gateway) this will come from the verified JWT instead
  // of the request body — accepted here so Booking Service is testable
  // on its own before the gateway exists.
  @IsUUID()
  customerId: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  @MinLength(2)
  serviceName: string;

  @IsISO8601()
  startTime: string;
}
