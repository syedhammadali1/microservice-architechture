const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface AuthResponse {
  accessToken: string;
  user: { id: string; name: string; email: string };
}

export interface Booking {
  id: string;
  customerId: string;
  customerEmail: string;
  serviceName: string;
  startTime: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new Error(message ?? `Request failed with status ${response.status}`);
  }

  return body as T;
}

export function register(name: string, email: string, password: string) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email: string, password: string) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function listBookings(token: string) {
  return request<Booking[]>('/bookings', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createBooking(token: string, serviceName: string, startTime: string) {
  return request<Booking>('/bookings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ serviceName, startTime }),
  });
}

export function cancelBooking(token: string, id: string) {
  return request<Booking>(`/bookings/${id}/cancel`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
}
