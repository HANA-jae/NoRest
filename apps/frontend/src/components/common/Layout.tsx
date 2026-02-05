import { Outlet } from 'react-router-dom';
import { Header } from './Header';

const mainStyle: React.CSSProperties = {
  flex: 1,
  padding: '24px',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
};

export function Layout() {
  return (
    <>
      <Header />
      <main style={mainStyle}>
        <Outlet />
      </main>
    </>
  );
}
