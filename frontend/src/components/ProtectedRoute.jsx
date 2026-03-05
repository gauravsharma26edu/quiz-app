import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  // If not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role restriction exists and user role not allowed
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;