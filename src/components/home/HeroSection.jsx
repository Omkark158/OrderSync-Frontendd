// src/components/home/HeroSection.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-20 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
              <Sparkles className="text-yellow-500" size={20} />
              <span className="text-sm font-medium text-gray-700">
                Fresh Food, Made with Love
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Authentic
              <span className="text-red-600"> Kerala Cuisine</span>
              <br />
              Delivered Fresh
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Experience the finest Chappathy, Appam, Veesappam, Pathiri & Bakery items.
              Order in advance for your special events and celebrations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/menu')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                Browse Menu
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200"
              >
                Get Started
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <p className="text-3xl font-bold text-red-600">1000+</p>
                <p className="text-sm text-gray-600 mt-1">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">50+</p>
                <p className="text-sm text-gray-600 mt-1">Menu Items</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">24/7</p>
                <p className="text-sm text-gray-600 mt-1">Order Support</p>
              </div>
            </div>
          </div>

          {/* Right Content - Image/Illustration */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative z-10">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=600&fit=crop"
                  alt="Fresh Kerala Food"
                  className="w-full h-96 object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition-transform animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fresh Daily</p>
                  <p className="text-xs text-gray-600">100% Quality</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition-transform animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-600">On Time, Every Time</p>
                </div>
              </div>
            </div>

            {/* Decorative Dots */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10">
              <div className="grid grid-cols-5 gap-4 opacity-30">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-red-400 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;