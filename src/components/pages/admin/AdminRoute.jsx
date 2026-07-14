import { Navigate, useLocation } from 'react-router-dom';

const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};

export default function AdminRoute({ children }) {
  const location = useLocation();
  const user = getUser();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
