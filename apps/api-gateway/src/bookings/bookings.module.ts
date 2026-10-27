import { Module } from '@nestjs/common';
import { ProxyModule } from '../common/proxy/proxy.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [ProxyModule],
  controllers: [BookingsController],
  providers: [JwtAuthGuard],
})
export class BookingsModule {}
