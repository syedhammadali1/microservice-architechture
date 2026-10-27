import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Module({
  imports: [HttpModule],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
