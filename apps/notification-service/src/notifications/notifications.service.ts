import { Injectable, Logger } from '@nestjs/common';
import { BookingCreatedEvent } from './booking-created.event';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // Stand-in for a real email/SMS provider — logging is enough to prove
  // the event pipeline works end to end.
  sendBookingConfirmation(event: BookingCreatedEvent) {
    this.logger.log(
      `Confirmation sent to ${event.customerEmail}: "${event.serviceName}" booked for ${event.startTime} (booking ${event.bookingId})`,
    );
  }
}
