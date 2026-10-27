import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Hybrid app: a tiny HTTP server for /health, plus a RabbitMQ consumer
  // for booking_events — both run in the same process.
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672'],
      queue: 'booking_events',
      queueOptions: { durable: true },
      // Manual ack: a message only leaves the queue once our handler
      // finishes successfully, so a crash mid-processing redelivers it
      // instead of silently losing it.
      noAck: false,
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(`notification-service listening on ${port}, consuming booking_events`);
}
bootstrap();
