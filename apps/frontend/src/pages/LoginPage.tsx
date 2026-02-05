import { Link } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { ROUTES } from '@/router/routes';

const pageStyle: React.CSSProperties = {
  padding: '40px 20px',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '24px',
  fontSize: '24px',
  fontWeight: 600,
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '16px',
  fontSize: '14px',
  color: '#666',
};

export function LoginPage() {
  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>Login</h2>
      <LoginForm />
      <p style={footerStyle}>
        Don't have an account? <Link to={ROUTES.REGISTER}>Register</Link>
      </p>
    </div>
  );
}
