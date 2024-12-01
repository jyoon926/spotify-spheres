import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute() {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet context={user} /> : <Navigate to="/" />;
}
