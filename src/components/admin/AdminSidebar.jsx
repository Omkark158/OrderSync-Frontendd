// ============================================
// components/admin/AdminSidebar.jsx - WITH PROFILE
// ============================================
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  FileText, 
  User,
  LogOut 
} from 'lucide-react';

const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/menu', icon: UtensilsCrossed, label: 'Menu' },
    { path: '/admin/invoices', icon: FileText, label: 'Invoices' },
    { path: '/admin/profile', icon: User, label: 'Profile' }, // ✅ ADDED
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-red-600">Sachin Foods</h2>
        <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-red-50 text-red-600 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;