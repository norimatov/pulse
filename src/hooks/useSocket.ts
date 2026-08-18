import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

/**
 * Backend'dagi OrdersGateway ('/live' namespace) bilan ulanishni boshqaradi.
 * Token bo'lganda avtomatik ulanadi, komponent unmount bo'lganda uziladi.
 */
export function useSocket() {
  const { token, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const wsUrl = import.meta.env.VITE_WS_URL ?? 'http://localhost:3000/live';
    const socket = io(wsUrl, {
      transports: ['websocket'],
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, token]);

  return { socket: socketRef.current, connected };
}
