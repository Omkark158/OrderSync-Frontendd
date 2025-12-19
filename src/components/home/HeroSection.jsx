import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Award, Zap, ArrowRight } from 'lucide-react';
import img1 from '../../assets/img1.jpeg';
import img2 from '../../assets/img2.jpeg';
import img3 from '../../assets/img3.jpeg';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [img1, img2, img3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Separate functions for clarity
  const goToMenu = () => {
    navigate('/menu'); // Protected → will redirect to login/signup if not logged in
  };

  const goToSignup = () => {
    navigate('/signup'); // Direct to signup for new users
  };

  return (
    <section className="relative bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
              <Sparkles className="text-yellow-500" size={20} />
              <span className="text-sm font-medium text-gray-700">
                Fresh Food, Made with Love
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Authentic
              <span className="text-red-600"> Kerala Cuisine</span>
              <br />
              Delivered Fresh
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Experience the finest Chappathy, Appam, Veesappam, Pathiri & Bakery items.
              Order in advance for your special events and celebrations.
            </p>
            {/* BUTTONS - Fixed: Get Started now goes to /signup */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={goToMenu}
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 shadow-md"
              >
                Browse Menu
                <ArrowRight size={24} />
              </button>
              <button
                onClick={goToSignup}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
              >
                Get Started
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT - Image carousel unchanged */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={images[currentImageIndex]}
                  alt="Fresh Kerala Food"
                  className="w-full h-72 md:h-88 object-cover transition-opacity duration-1000"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/60'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fresh Daily</p>
                  <p className="text-xs text-gray-600">100% Quality</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Zap className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-600">On Time, Every Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;