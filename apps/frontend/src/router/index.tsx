import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SimulatorPage } from '@/pages/SimulatorPage';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.SIMULATOR,
    element: <SimulatorPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: <DashboardPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
