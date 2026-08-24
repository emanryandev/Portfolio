import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../api/queries';
import { PageLoader } from '@/components/shared/PageLoader';

export const RequireAuth = () => {
  const { data: user, isLoading, isError } = useUser();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !user) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
