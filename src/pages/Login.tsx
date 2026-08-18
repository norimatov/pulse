import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@dashboard.uz');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="aurora-bg" />
      <div className="glass-panel auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">⟡</div>
          <div className="auth-logo-text">Pulse</div>
        </div>
        <h1 className="auth-title">Xush kelibsiz</h1>
        <p className="auth-subtitle">Hisobingizga kirib jonli boshqaruv panelini kuzating</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="siz@misol.uz"
              required
            />
          </div>
          <div className="field">
            <label>Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <div className="demo-hint">
          Demo: admin@dashboard.uz / admin123 (npm run seed dan keyin)
        </div>

        <p className="auth-switch">
          Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
}
