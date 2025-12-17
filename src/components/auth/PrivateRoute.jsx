// src/components/auth/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import Loader from '../common/Loader';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  try {
    JSON.parse(user); // Validate user data
    return children;
  } catch (error) {
    // Invalid user data - clear and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;