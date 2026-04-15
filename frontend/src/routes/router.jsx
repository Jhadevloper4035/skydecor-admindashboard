import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import { useAuthContext } from '@/context/useAuthContext';
import { appRoutes, authRoutes } from '@/routes/index';
import AdminLayout from '@/layouts/AdminLayout';

const ALLOWED_ROLES = ['admin', 'superadmin'];

const AppRouter = props => {
  const { isAuthenticated, user, loading } = useAuthContext();

  // Wait for the /me check before rendering any route to avoid flicker
  if (loading) return null;

  const canAccess = isAuthenticated && ALLOWED_ROLES.includes(user?.accessType);

  return <Routes>
      {(authRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<AuthLayout {...props}>{route.element}</AuthLayout>} />
      ))}

      {(appRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={
          canAccess
            ? <AdminLayout {...props}>{route.element}</AdminLayout>
            : <Navigate to={{ pathname: '/auth/sign-in', search: 'redirectTo=' + route.path }} />
        } />
      ))}
    </Routes>;
};
export default AppRouter;