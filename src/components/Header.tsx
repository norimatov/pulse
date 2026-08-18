interface HeaderProps {
  title: string;
  subtitle: string;
  connected: boolean;
  onlineClients: number;
}

export function Header({ title, subtitle, connected, onlineClients }: HeaderProps) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      <div className={`live-badge ${connected ? 'online' : 'offline'}`}>
        <span className="pulse-dot" />
        {connected ? `Jonli · ${onlineClients} onlayn` : 'Ulanmagan'}
      </div>
    </div>
  );
}
