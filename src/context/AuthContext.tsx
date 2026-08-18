import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../api/client';
import type { AuthResponse, User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): User | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));

  const persist = useCallback((data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
      persist(data);
    },
    [persist],
  );

  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        fullName,
        email,
        password,
      });
      persist(data);
    },
    [persist],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isAuthenticated: Boolean(token), login, register, logout }),
    [user, token, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  return ctx;
}
