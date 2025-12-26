import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SessionWarning = ({ onExtend, onLogout }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes warning
  const navigate = useNavigate();

  useEffect(() => {
    // Check token expiration
    const checkSession = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      
      if (!token) return;

      try {
        // Decode JWT to get expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiresAt = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        // Show warning 5 minutes before expiration
        if (timeUntilExpiry <= 300000 && timeUntilExpiry > 0) {
          setShowWarning(true);
          setTimeLeft(Math.floor(timeUntilExpiry / 1000));
        } else if (timeUntilExpiry <= 0) {
          // Token expired
          handleSessionExpired();
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);
    checkSession(); // Initial check

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showWarning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showWarning, timeLeft]);

  const handleSessionExpired = () => {
    setShowWarning(false);
    toast.error('Your session has expired. Please login again.');
    
    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('cart');
    
    // Redirect to appropriate login
    const isAdmin = window.location.pathname.includes('/admin');
    navigate(isAdmin ? '/admin/secure-access' : '/login');
    
    if (onLogout) onLogout();
  };

  const handleExtendSession = async () => {
    try {
      // Make API call to refresh token
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update token in localStorage (fallback)
        if (data.token) {
          const tokenKey = window.location.pathname.includes('/admin') ? 'adminToken' : 'token';
          localStorage.setItem(tokenKey, data.token);
        }
        
        setShowWarning(false);
        toast.success('Session extended successfully!');
        
        if (onExtend) onExtend();
      } else {
        handleSessionExpired();
      }
    } catch (error) {
      console.error('Error extending session:', error);
      toast.error('Failed to extend session');
      handleSessionExpired();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-bounce-once">
        {/* Close Button */}
        <button
          onClick={() => setShowWarning(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-yellow-600" size={32} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Session Expiring Soon
          </h3>
          <p className="text-gray-600 mb-4">
            Your session will expire in:
          </p>
          
          {/* Countdown */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="text-yellow-600" size={24} />
            <span className="text-4xl font-bold text-yellow-600">
              {formatTime(timeLeft)}
            </span>
          </div>

          <p className="text-sm text-gray-500">
            Would you like to extend your session?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleExtendSession}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Extend Session
          </button>
          <button
            onClick={handleSessionExpired}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 300) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;