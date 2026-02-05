import { Link } from 'react-router-dom';
import { RegisterForm } from '@/components/auth/RegisterForm';
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

export function RegisterPage() {
  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>Register</h2>
      <RegisterForm />
      <p style={footerStyle}>
        Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
      </p>
    </div>
  );
}
