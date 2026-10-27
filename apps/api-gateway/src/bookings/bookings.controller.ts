import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from '../common/proxy/proxy.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, GatewayUser } from '../common/decorators/current-user.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(
    private readonly proxy: ProxyService,
    private readonly config: ConfigService,
  ) {}

  private get baseUrl() {
    return this.config.get<string>('BOOKING_SERVICE_URL');
  }

  @Post()
  create(@Body() dto: CreateBookingDto, @CurrentUser() user: GatewayUser) {
    return this.proxy.forward('post', `${this.baseUrl}/bookings`, {
      data: {
        customerId: user.id,
        customerEmail: user.email,
        serviceName: dto.serviceName,
        startTime: dto.startTime,
      },
    });
  }

  @Get()
  findAll(@CurrentUser() user: GatewayUser) {
    return this.proxy.forward('get', `${this.baseUrl}/bookings`, {
      params: { customerId: user.id },
    });
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: GatewayUser) {
    // Ownership is enforced downstream, in Booking Service, using this
    // customerId from the verified JWT — never from anything the client
    // could supply directly.
    return this.proxy.forward('patch', `${this.baseUrl}/bookings/${id}/cancel`, {
      data: { customerId: user.id },
    });
  }
}
