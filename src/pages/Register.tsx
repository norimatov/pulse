import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(fullName, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
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
        <h1 className="auth-title">Hisob yarating</h1>
        <p className="auth-subtitle">Bir necha soniyada jonli dashboard'ga ega bo'ling</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>To'liq ism</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ism Familiya" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="siz@misol.uz" required />
          </div>
          <div className="field">
            <label>Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kamida 6 belgi"
              required
              minLength={6}
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Yaratilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <p className="auth-switch">
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
}
