import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from './Toast';
import { ConfirmModal } from './ConfirmModal';

export function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      <main className="flex-1 page-enter">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <ConfirmModal />
    </div>
  );
}
