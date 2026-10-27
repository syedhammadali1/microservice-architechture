import { FormEvent, useEffect, useState } from 'react';
import { AuthResponse, Booking, cancelBooking, createBooking, listBookings } from '../api';

interface Props {
  auth: AuthResponse;
  onLogout: () => void;
}

export default function Dashboard({ auth, onLogout }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    try {
      setBookings(await listBookings(auth.accessToken));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createBooking(auth.accessToken, serviceName, new Date(startTime).toISOString());
      setServiceName('');
      setStartTime('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: string) {
    setError(null);
    try {
      await cancelBooking(auth.accessToken, id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Hi, {auth.user.name}</h1>
        <button onClick={onLogout}>Logout</button>
      </header>

      <form onSubmit={handleCreate} className="booking-form">
        <input
          placeholder="Service (e.g. Haircut)"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          required
        />
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Booking…' : 'Book'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="booking-list">
        {bookings.map((booking) => (
          <li key={booking.id} className={booking.status}>
            <div>
              <strong>{booking.serviceName}</strong>
              <span>{new Date(booking.startTime).toLocaleString()}</span>
            </div>
            <div className="status">
              {booking.status}
              {booking.status === 'confirmed' && <button onClick={() => handleCancel(booking.id)}>Cancel</button>}
            </div>
          </li>
        ))}
        {bookings.length === 0 && <p>No bookings yet.</p>}
      </ul>
    </div>
  );
}
