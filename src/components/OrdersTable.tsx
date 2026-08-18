import { useState, type FormEvent } from 'react';
import { OrderStatus, type Order } from '../types';

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'kutilmoqda',
  [OrderStatus.PROCESSING]: 'jarayonda',
  [OrderStatus.COMPLETED]: 'bajarildi',
  [OrderStatus.CANCELLED]: 'bekor qilindi',
};

const statusClass: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'status-pending',
  [OrderStatus.PROCESSING]: 'status-processing',
  [OrderStatus.COMPLETED]: 'status-completed',
  [OrderStatus.CANCELLED]: 'status-cancelled',
};

function formatMoney(value: number | string): string {
  const num = typeof value === 'string' ? Number(value) : value;
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface OrdersTableProps {
  orders: Order[];
  recentIds: Set<string>;
  onCreate: (payload: {
    customerName: string;
    product: string;
    quantity: number;
    amount: number;
    status: OrderStatus;
  }) => Promise<void>;
}

export function OrdersTable({ orders, recentIds, onCreate }: OrdersTableProps) {
  const [customerName, setCustomerName] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!customerName || !product || !amount) return;
    setSubmitting(true);
    try {
      await onCreate({
        customerName,
        product,
        quantity: Number(quantity) || 1,
        amount: Number(amount),
        status,
      });
      setCustomerName('');
      setProduct('');
      setQuantity('1');
      setAmount('');
      setStatus(OrderStatus.PENDING);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel table-panel">
      <div className="table-panel-header">
        <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>So'nggi buyurtmalar</h3>
        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{orders.length} ta yozuv</span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">Hozircha buyurtmalar yo'q. Pastdan birinchisini qo'shing.</div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mijoz</th>
              <th>Mahsulot</th>
              <th>Soni</th>
              <th>Summasi</th>
              <th>Holati</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={recentIds.has(order.id) ? 'row-flash' : ''}>
                <td>{order.customerName}</td>
                <td>{order.product}</td>
                <td className="mono">{order.quantity}</td>
                <td className="amount-cell">{formatMoney(order.amount)}</td>
                <td>
                  <span className={`status-badge ${statusClass[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="mono" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                  {new Date(order.createdAt).toLocaleString('uz-UZ', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form className="inline-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Mijoz</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ism familiya" required />
        </div>
        <div className="field">
          <label>Mahsulot</label>
          <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Mahsulot nomi" required />
        </div>
        <div className="field">
          <label>Soni</label>
          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>
        <div className="field">
          <label>Summasi ($)</label>
          <input type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="field">
          <label>Holati</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
            {Object.values(OrderStatus).map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-secondary" type="submit" disabled={submitting}>
          {submitting ? 'Qo\'shilmoqda...' : '+ Qo\'shish'}
        </button>
      </form>
    </div>
  );
}
