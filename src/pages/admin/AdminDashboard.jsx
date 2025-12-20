// ============================================
// AdminDashboard.jsx - Fixed with Auth Check
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  FileText, 
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    activeMenuItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/admin/secure-access');
      return;
    }

    console.log('Token exists, fetching dashboard data');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/secure-access');
        return;
      }

      console.log('Fetching dashboard data with token:', token.substring(0, 20) + '...');

      // Backend URL - change this to match your backend
      const API_URL = 'http://localhost:5000/api';
      
      // Fetch orders
      let ordersData = { success: false, data: [] };
      try {
        console.log('Fetching orders from', `${API_URL}/orders`);
        const ordersResponse = await fetch(`${API_URL}/orders`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        console.log('Orders response status:', ordersResponse.status);
        
        if (ordersResponse.ok) {
          ordersData = await ordersResponse.json();
          console.log('Orders data received:', ordersData);
        } else if (ordersResponse.status === 401) {
          console.error('Orders fetch: Unauthorized (401)');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/admin/secure-access');
          return;
        } else {
          const errorText = await ordersResponse.text();
          console.error('Orders fetch error:', ordersResponse.status, errorText);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }

      // Calculate order stats
      if (ordersData.success && ordersData.data) {
        const orders = ordersData.data;
        
        const pending = orders.filter(o => o.orderStatus === 'pending').length;
        const completed = orders.filter(o => o.orderStatus === 'delivered').length;
        const revenue = orders
          .filter(o => o.orderStatus !== 'cancelled')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        const today = new Date().toDateString();
        const todayCount = orders.filter(o => 
          new Date(o.createdAt).toDateString() === today
        ).length;

        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          pendingOrders: pending,
          completedOrders: completed,
          totalRevenue: revenue,
          todayOrders: todayCount,
        }));

        setRecentOrders(orders.slice(0, 5));
      }

      // Fetch menu items
      try {
        console.log('Fetching menu from', `${API_URL}/menu`);
        const menuResponse = await fetch(`${API_URL}/menu`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        console.log('Menu response status:', menuResponse.status);
        
        if (menuResponse.ok) {
          const menuData = await menuResponse.json();
          console.log('Menu data received:', menuData);
          
          if (menuData.success) {
            const menuItems = menuData.data || [];
            const activeCount = Array.isArray(menuItems) 
              ? menuItems.filter(item => item.isAvailable && !item.isDeleted).length 
              : 0;
            
            setStats(prev => ({
              ...prev,
              activeMenuItems: activeCount,
            }));
          }
        } else if (menuResponse.status === 401) {
          console.error('Menu fetch: Unauthorized (401)');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/admin/secure-access');
          return;
        } else {
          const errorText = await menuResponse.text();
          console.error('Menu fetch error:', menuResponse.status, errorText);
        }
      } catch (err) {
        console.error('Error fetching menu items:', err);
      }

    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/secure-access');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-purple-100 text-purple-700',
      ready: 'bg-green-100 text-green-700',
      delivered: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-y-auto">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, Admin!</p>
              </div>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="text-red-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-red-700 font-medium">{error}</p>
                <button 
                  onClick={fetchDashboardData}
                  className="mt-2 text-sm text-red-600 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ShoppingBag className="text-blue-600" size={24} />
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>

            {/* Pending Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Pending Orders</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
            </div>

            {/* Completed Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Completed Orders</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedOrders}</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <DollarSign className="text-red-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>

            {/* Today's Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Package className="text-purple-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Today's Orders</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayOrders}</p>
            </div>

            {/* Active Menu Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <UtensilsCrossed className="text-orange-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Active Menu Items</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeMenuItems}</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                View All →
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No orders yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {order.orderNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {order.customerName || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {order.orderItems?.length || 0} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <button
              onClick={() => navigate('/admin/orders')}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
            >
              <ShoppingBag className="text-red-600 mb-3" size={32} />
              <h3 className="font-bold text-lg text-gray-900 mb-1">Manage Orders</h3>
              <p className="text-sm text-gray-600">View and update order status</p>
            </button>

            <button
              onClick={() => navigate('/admin/menu')}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
            >
              <UtensilsCrossed className="text-red-600 mb-3" size={32} />
              <h3 className="font-bold text-lg text-gray-900 mb-1">Manage Menu</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove menu items</p>
            </button>

            <button
              onClick={() => navigate('/admin/invoices')}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
            >
              <FileText className="text-red-600 mb-3" size={32} />
              <h3 className="font-bold text-lg text-gray-900 mb-1">View Invoices</h3>
              <p className="text-sm text-gray-600">Download and manage invoices</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;