import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

type Method = 'get' | 'post' | 'patch';

@Injectable()
export class ProxyService {
  constructor(private readonly http: HttpService) {}

  // Forwards a request to a downstream service and relays its response (or
  // its error status/body) back, so a client never has to know the gateway
  // is talking to a separate service underneath.
  async forward<T = unknown>(
    method: Method,
    url: string,
    options: { data?: unknown; params?: Record<string, unknown> } = {},
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.http.request<T>({
          method,
          url,
          data: options.data,
          params: options.params,
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new HttpException(
          axiosError.response.data as object,
          axiosError.response.status,
        );
      }
      throw new ServiceUnavailableException('Downstream service unavailable');
    }
  }
}
