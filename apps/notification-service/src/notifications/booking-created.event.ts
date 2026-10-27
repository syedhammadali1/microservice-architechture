export interface BookingCreatedEvent {
  bookingId: string;
  customerId: string;
  customerEmail: string;
  serviceName: string;
  startTime: string;
}
