// ============================================
// 9. NotFound.jsx - 404 Page
// ============================================
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <div className="text-6xl mb-4">🍽️</div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Oops! The page you're looking for seems to have been eaten. 
          Let's get you back to delicious food!
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center gap-2"
          >
            <Home size={18} />
            Go Home
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Quick Links:</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/menu')} className="text-blue-600 hover:underline">
              Browse Menu
            </button>
            <button onClick={() => navigate('/orders')} className="text-blue-600 hover:underline">
              My Orders
            </button>
            <button onClick={() => navigate('/profile')} className="text-blue-600 hover:underline">
              My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;