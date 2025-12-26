// ============================================
// components/common/Navbar.jsx - FULLY FIXED
// ============================================
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserData();
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };

    // Listen for storage changes (for logout across tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'adminUser' || e.key === 'token' || e.key === 'adminToken') {
        loadUserData();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorageChange);

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  // ✅ Load user data based on current route
  const loadUserData = () => {
    try {
      const isAdminRoute = location.pathname.startsWith('/admin');
      
      if (isAdminRoute) {
        // Load admin user
        const adminUser = localStorage.getItem('adminUser');
        if (adminUser) {
          const parsed = JSON.parse(adminUser);
          console.log('📍 Navbar: Admin user loaded:', parsed.name);
          setUser(parsed);
        } else {
          setUser(null);
        }
      } else {
        // Load regular user
        const regularUser = localStorage.getItem('user');
        if (regularUser) {
          const parsed = JSON.parse(regularUser);
          console.log('📍 Navbar: Regular user loaded:', parsed.name);
          setUser(parsed);
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    }
  };

  // ✅ Update cart count
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  // ✅ Handle logout
  const handleLogout = () => {
    console.log('🚪 Navbar: Logging out user:', user?.role);
    
    const wasAdmin = user?.role === 'admin';
    
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('cart');
    
    setUser(null);
    setCartCount(0);
    
    // Navigate based on previous role
    if (wasAdmin) {
      navigate('/admin/secure-access', { replace: true });
      toast.success('Admin logged out successfully');
    } else {
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/orders', label: 'My Orders' },
  ];

  // ✅ Don't show admin routes in regular navbar
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // ✅ If admin route, don't render regular navbar
  if (isAdminRoute) {
    return null;
  }

  // ✅ If not logged in on home page, show minimal navbar
  if (!user && location.pathname === '/') {
    return (
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Sachin Foods</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-6 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // ✅ Full navbar for logged-in users or non-home pages
  return (
    <nav 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-red-600 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Sachin Foods</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-red-600'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            {user && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={20} />
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-red-600'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-gray-700"
                >
                  <User size={20} />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 py-2 text-red-600 font-medium w-full"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-center bg-red-600 text-white rounded-lg font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;