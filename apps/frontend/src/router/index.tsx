import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SimulatorPage } from '@/pages/SimulatorPage';
import { ResignationQuizPage } from '@/pages/ResignationQuizPage';
import { SalaryCalculatorPage } from '@/pages/SalaryCalculatorPage';
import { PensionCalculatorPage } from '@/pages/PensionCalculatorPage';
import { JobGuidePage } from '@/pages/JobGuidePage';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.SIMULATOR,
    element: <SimulatorPage />,
  },
  {
    path: ROUTES.RESIGNATION_QUIZ,
    element: <ResignationQuizPage />,
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
        path: ROUTES.SALARY_CALCULATOR,
        element: <SalaryCalculatorPage />,
      },
      {
        path: ROUTES.PENSION_CALCULATOR,
        element: <PensionCalculatorPage />,
      },
      {
        path: ROUTES.JOB_GUIDE,
        element: <JobGuidePage />,
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
