import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from '../common/proxy/proxy.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly proxy: ProxyService,
    private readonly config: ConfigService,
  ) {}

  private get baseUrl() {
    return this.config.get<string>('AUTH_SERVICE_URL');
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.proxy.forward('post', `${this.baseUrl}/auth/register`, {
      data: dto,
    });
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.proxy.forward('post', `${this.baseUrl}/auth/login`, {
      data: dto,
    });
  }
}
