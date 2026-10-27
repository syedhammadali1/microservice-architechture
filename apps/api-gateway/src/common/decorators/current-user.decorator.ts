import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface GatewayUser {
  id: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): GatewayUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
