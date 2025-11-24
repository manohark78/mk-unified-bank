import { Navigate } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('token');
const mustChangePassword = () => localStorage.getItem('passwordChangeRequired') === 'true';

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (mustChangePassword() && window.location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }
  return children;
}
