// src/components/auth/AdminRoute.jsx
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  // Check if admin is authenticated
  if (!adminToken || !adminUser) {
    return <Navigate to="/admin-secret-xyz" replace />;
  }

  // Verify admin role
  try {
    const user = JSON.parse(adminUser);
    if (user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/admin-secret-xyz" replace />;
  }

  return children;
};

export default AdminRoute;