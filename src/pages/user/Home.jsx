import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

import HeroSection from '../../components/home/HeroSection';
import Features from '../../components/home/Features';
import HowItWorks from '../../components/home/HowItWorks';
import Testimonials from '../../components/home/Testimonials';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Invalid user data in localStorage');
      }
    }
  }, []);

  const handleBrowseMenu = () => {
    if (user) {
      navigate('/menu');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      {/* Order Now CTA */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Order Fresh Food?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Experience the authentic taste of traditional Kerala cuisine
          </p>
          <button
            onClick={handleBrowseMenu}
            className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Browse Menu
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      <Features />
      <HowItWorks />
      <Testimonials />

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600">We're here to serve you the best</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-white p-6 rounded-xl shadow-md">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-red-600" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Call Us</h3>
              <p className="text-gray-600">9539387240</p>
              <p className="text-gray-600">9388808825</p>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-md">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-red-600" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-gray-600">info@sachinfoods.com</p>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-md">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-red-600" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Location</h3>
              <p className="text-gray-600">Kundara, Kollam</p>
              <p className="text-gray-600">Kerala, India</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;