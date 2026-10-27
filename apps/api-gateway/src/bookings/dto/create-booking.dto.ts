import { IsISO8601, IsString, MinLength } from 'class-validator';

// Deliberately no customerId/customerEmail here — those come from the
// verified JWT (see BookingsController), not from whatever the client sends.
export class CreateBookingDto {
  @IsString()
  @MinLength(2)
  serviceName: string;

  @IsISO8601()
  startTime: string;
}
