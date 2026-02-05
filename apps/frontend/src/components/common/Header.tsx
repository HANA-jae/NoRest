import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/router/routes';

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 24px',
  backgroundColor: '#1976d2',
  color: 'white',
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 500,
};

const logoutBtnStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.2)',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
};

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <header style={headerStyle}>
      <Link to={ROUTES.HOME} style={{ ...linkStyle, fontSize: '20px' }}>
        HAN
      </Link>
      <nav style={navStyle}>
        {isAuthenticated ? (
          <>
            <span>{user?.name}</span>
            <Link to={ROUTES.DASHBOARD} style={linkStyle}>
              Dashboard
            </Link>
            <button style={logoutBtnStyle} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={ROUTES.LOGIN} style={linkStyle}>
              Login
            </Link>
            <Link to={ROUTES.REGISTER} style={linkStyle}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
