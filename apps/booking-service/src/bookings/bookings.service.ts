import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookings: Repository<Booking>,
    @Inject('BOOKING_EVENTS') private readonly events: ClientProxy,
  ) {}

  async create(dto: CreateBookingDto) {
    const booking = await this.bookings.save(
      this.bookings.create({
        customerId: dto.customerId,
        customerEmail: dto.customerEmail,
        serviceName: dto.serviceName,
        startTime: new Date(dto.startTime),
      }),
    );

    // Fire-and-forget: booking already succeeded and is durable in MySQL
    // regardless of whether anyone is listening for this event right now.
    this.events.emit('booking.created', {
      bookingId: booking.id,
      customerId: booking.customerId,
      customerEmail: booking.customerEmail,
      serviceName: booking.serviceName,
      startTime: booking.startTime,
    });

    return booking;
  }

  findAll(customerId?: string) {
    return this.bookings.find({
      where: customerId ? { customerId } : {},
      order: { startTime: 'ASC' },
    });
  }

  async cancel(id: string, customerId: string) {
    const booking = await this.bookings.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.customerId !== customerId) {
      throw new ForbiddenException('You do not own this booking');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new ConflictException('Booking already cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookings.save(booking);
  }
}
