export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Order {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  amount: number | string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  revenue: number;
  updatedAt: string;
}

export interface WeeklyTrendPoint {
  date: string;
  orders: number;
  revenue: number;
}
