import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Global: the gateway verifies JWTs locally using the same secret Auth
// Service signs with, instead of calling back into Auth Service on every
// request. One shared secret, no network round-trip, no extra coupling.
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}
