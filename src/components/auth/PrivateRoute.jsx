// ============================================
// src/components/auth/PrivateRoute.jsx - FULLY FIXED
// ============================================
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  
  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Check if user is authenticated
  if (!isAuthenticated()) {
    toast.error('Please login to access this page', {
      duration: 3000,
    });
    return <Navigate to="/login" replace />;
  }

  // ✅ CRITICAL: Block admins from accessing user routes
  if (isAdmin()) {
    toast.error('Admin users cannot access customer pages. Use admin dashboard instead.', {
      duration: 4000,
      icon: '⚠️',
    });
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ User is authenticated and NOT admin
  return children;
};

export default PrivateRoute;