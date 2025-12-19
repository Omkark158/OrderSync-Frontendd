const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  if (!adminToken || !adminUser) {
    return <Navigate to="/admin/secure-access" replace />;
  }

  try {
    const user = JSON.parse(adminUser);
    if (user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/admin/secure-access" replace />;
  }

  return children;
};

export default AdminRoute; 