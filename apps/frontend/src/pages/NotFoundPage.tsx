import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

const pageStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 20px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '72px',
  fontWeight: 700,
  color: '#ddd',
  marginBottom: '8px',
};

const messageStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#666',
  marginBottom: '24px',
};

export function NotFoundPage() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>404</h1>
      <p style={messageStyle}>Page not found</p>
      <Link to={ROUTES.HOME}>
        <button className="btn-primary">Go Home</button>
      </Link>
    </div>
  );
}
