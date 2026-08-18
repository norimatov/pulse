import { useAuth } from '../context/AuthContext';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="auth-logo" style={{ marginBottom: 0 }}>
        <div className="auth-logo-mark">⟡</div>
        <div className="auth-logo-text">Pulse</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-item active">
          <span>📊</span> Dashboard
        </div>
        <div className="sidebar-nav-item">
          <span>📦</span> Buyurtmalar
        </div>
        <div className="sidebar-nav-item">
          <span>📈</span> Statistika
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{user ? initials(user.fullName) : '?'}</div>
          <div style={{ overflow: 'hidden' }}>
            <div className="sidebar-user-name">{user?.fullName}</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
        </div>
        <button className="icon-btn" onClick={logout} title="Chiqish">
          ⏻
        </button>
      </div>
    </aside>
  );
}
