import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { BookingCreatedEvent } from './booking-created.event';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('booking.created')
  handleBookingCreated(
    @Payload() data: BookingCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    this.notificationsService.sendBookingConfirmation(data);

    // noAck is false, so we must ack explicitly once processing succeeds —
    // otherwise RabbitMQ keeps redelivering the message.
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
