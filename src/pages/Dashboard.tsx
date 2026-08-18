import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useSocket } from '../hooks/useSocket';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { LiveChart } from '../components/LiveChart';
import { OrdersTable } from '../components/OrdersTable';
import { OrderStatus, type Order, type Stats, type WeeklyTrendPoint } from '../types';

const emptyStats: Stats = {
  total: 0,
  pending: 0,
  processing: 0,
  completed: 0,
  cancelled: 0,
  revenue: 0,
  updatedAt: new Date().toISOString(),
};

export function Dashboard() {
  const { socket, connected } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [trend, setTrend] = useState<WeeklyTrendPoint[]>([]);
  const [onlineClients, setOnlineClients] = useState(1);
  const [recentIds, setRecentIds] = useState<Set<string>>(new Set());

  const flashRow = useCallback((id: string) => {
    setRecentIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setRecentIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1400);
  }, []);

  // Boshlang'ich ma'lumotlarni yuklash
  useEffect(() => {
    (async () => {
      const [ordersRes, statsRes, trendRes] = await Promise.all([
        api.get<Order[]>('/orders'),
        api.get<Stats>('/orders/stats'),
        api.get<WeeklyTrendPoint[]>('/stats/weekly-trend'),
      ]);
      setOrders(ordersRes.data);
      setStats(statsRes.data);
      setTrend(trendRes.data);
    })();
  }, []);

  // WebSocket real-time voqealarga obuna bo'lish
  useEffect(() => {
    if (!socket) return undefined;

    const onCreated = (order: Order) => {
      setOrders((prev) => [order, ...prev].slice(0, 50));
      flashRow(order.id);
    };
    const onUpdated = (order: Order) => {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
      flashRow(order.id);
    };
    const onDeleted = ({ id }: { id: string }) => {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    };
    const onStats = (data: Stats) => setStats(data);
    const onPresence = (data: { online: number }) => setOnlineClients(Math.max(1, data.online));

    socket.on('order:created', onCreated);
    socket.on('order:updated', onUpdated);
    socket.on('order:deleted', onDeleted);
    socket.on('stats:update', onStats);
    socket.on('presence:update', onPresence);

    return () => {
      socket.off('order:created', onCreated);
      socket.off('order:updated', onUpdated);
      socket.off('order:deleted', onDeleted);
      socket.off('stats:update', onStats);
      socket.off('presence:update', onPresence);
    };
  }, [socket, flashRow]);

  const handleCreate = useCallback(
    async (payload: {
      customerName: string;
      product: string;
      quantity: number;
      amount: number;
      status: OrderStatus;
    }) => {
      // Backend WebSocket orqali barcha clientlarga (shu jumladan bizga) qaytadan yuboradi,
      // shuning uchun bu yerda lokal state'ni qo'lda yangilashimiz shart emas.
      await api.post('/orders', payload);
    },
    [],
  );

  return (
    <div className="app-shell">
      <div className="aurora-bg" />
      <Sidebar />
      <main className="main-content">
        <Header
          title="Boshqaruv paneli"
          subtitle="Buyurtmalar va daromad real vaqtda kuzatiladi"
          connected={connected}
          onlineClients={onlineClients}
        />

        <div className="stat-grid">
          <StatCard
            label="Jami buyurtmalar"
            value={stats.total.toLocaleString('en-US')}
            icon="📦"
            accent="#7c5cff"
            accentBg="rgba(124,92,255,0.16)"
          />
          <StatCard
            label="Kutilmoqda"
            value={stats.pending.toLocaleString('en-US')}
            icon="⏳"
            accent="#ffb84d"
            accentBg="rgba(255,184,77,0.16)"
          />
          <StatCard
            label="Bajarildi"
            value={stats.completed.toLocaleString('en-US')}
            icon="✅"
            accent="#35e6d0"
            accentBg="rgba(53,230,208,0.16)"
          />
          <StatCard
            label="Jami daromad"
            value={`$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon="💰"
            accent="#ff6b7a"
            accentBg="rgba(255,107,122,0.16)"
          />
        </div>

        <LiveChart data={trend} />

        <OrdersTable orders={orders} recentIds={recentIds} onCreate={handleCreate} />
      </main>
    </div>
  );
}
