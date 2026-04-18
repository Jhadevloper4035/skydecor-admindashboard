import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import { useAuthContext } from '@/context/useAuthContext';
import { appRoutes, authRoutes, publicRoutes, ALL_ACCESS_TYPES } from '@/routes/index';
import AdminLayout from '@/layouts/AdminLayout';
import Preloader from '@/components/Preloader';

const AppRouter = props => {
  const { isAuthenticated, user, loading } = useAuthContext();

  // Wait for the /me check before rendering any route to avoid flicker
  if (loading) return null;

  const isValidUser = isAuthenticated && ALL_ACCESS_TYPES.includes(user?.accessType);

  const routeElement = (route) => {
    if (!isValidUser) {
      return <Navigate to={{ pathname: '/auth/sign-in', search: 'redirectTo=' + route.path }} />;
    }
    if (route.roles && !route.roles.includes(user.accessType)) {
      return <Navigate to="/error-404" />;
    }
    return <AdminLayout {...props}>{route.element}</AdminLayout>;
  };

  return <Routes>
      {(publicRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={
          <Suspense fallback={<Preloader />}>{route.element}</Suspense>
        } />
      ))}

      {(authRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<AuthLayout {...props}>{route.element}</AuthLayout>} />
      ))}

      {(appRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={routeElement(route)} />
      ))}
    </Routes>;
};
export default AppRouter;