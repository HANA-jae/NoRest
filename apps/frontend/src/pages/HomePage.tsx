import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/router/routes';

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 20px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '36px',
  fontWeight: 700,
  marginBottom: '16px',
  color: '#1976d2',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#666',
  marginBottom: '32px',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
};

export function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>HAN</h1>
      <p style={subtitleStyle}>Welcome to the HAN Web Service</p>
      <div style={actionsStyle}>
        {isAuthenticated ? (
          <Link to={ROUTES.DASHBOARD}>
            <button className="btn-primary">Go to Dashboard</button>
          </Link>
        ) : (
          <>
            <Link to={ROUTES.LOGIN}>
              <button className="btn-primary">Login</button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <button className="btn-secondary">Register</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
