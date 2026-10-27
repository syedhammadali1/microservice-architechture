import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Reference only — Booking Service never queries Auth Service's database.
  @Column()
  customerId: string;

  // Snapshot, not a live copy: captured from the request at booking time so
  // this service can list/notify without calling Auth Service for every read.
  @Column()
  customerEmail: string;

  @Column()
  serviceName: string;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.CONFIRMED })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;
}
