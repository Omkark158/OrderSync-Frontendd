// src/components/home/Testimonials.jsx
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'Priya Menon',
      role: 'Event Organizer',
      location: 'Kollam',
      image: 'https://ui-avatars.com/api/?name=Priya+Menon&background=ef4444&color=fff&size=128',
      rating: 5,
      text: 'Sachin Foods made our wedding reception perfect! The Appam and Pathiri were incredibly fresh and delicious. The pre-order system made planning so easy!',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      location: 'Kundara',
      image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=3b82f6&color=fff&size=128',
      rating: 5,
      text: 'We order from Sachin Foods for all our corporate events. Their consistency in quality and timely delivery is unmatched. Highly recommended!',
    },
    {
      name: 'Anjali Nair',
      role: 'Home Chef',
      location: 'Kollam',
      image: 'https://ui-avatars.com/api/?name=Anjali+Nair&background=10b981&color=fff&size=128',
      rating: 5,
      text: 'Authentic Kerala taste! The Chappathy reminds me of my grandmother\'s cooking. Quick delivery and excellent customer service. Love it!',
    },
    {
      name: 'Suresh Pillai',
      role: 'IT Professional',
      location: 'Kundara',
      image: 'https://ui-avatars.com/api/?name=Suresh+Pillai&background=f59e0b&color=fff&size=128',
      rating: 5,
      text: 'The best part is the advance ordering feature. I can schedule my orders for the weekend and everything arrives fresh and hot. Amazing service!',
    },
    {
      name: 'Meera Das',
      role: 'Teacher',
      location: 'Kollam',
      image: 'https://ui-avatars.com/api/?name=Meera+Das&background=8b5cf6&color=fff&size=128',
      rating: 5,
      text: 'Hygiene and quality are top-notch. My kids love their bakery items! The online ordering system is very user-friendly. Keep up the great work!',
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <Quote size={400} className="absolute -top-20 -left-20 text-red-600" />
        <Quote size={400} className="absolute -bottom-20 -right-20 text-red-600 transform rotate-180" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our
            <span className="text-red-600"> Customers Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Sachin Foods for their events and daily meals
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-500">
            {/* Quote Icon */}
            <div className="mb-6">
              <Quote className="text-red-600" size={48} />
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star key={i} size={24} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 italic">
              "{testimonials[activeIndex].text}"
            </p>

            {/* Customer Info */}
            <div className="flex items-center gap-4">
              <img
                src={testimonials[activeIndex].image}
                alt={testimonials[activeIndex].name}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  {testimonials[activeIndex].name}
                </h4>
                <p className="text-sm text-gray-600">
                  {testimonials[activeIndex].role} • {testimonials[activeIndex].location}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? 'w-12 h-3 bg-red-600'
                    : 'w-3 h-3 bg-gray-300 hover:bg-red-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Additional Testimonials Grid (Desktop) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-16">
          {testimonials
            .filter((_, index) => index !== activeIndex)
            .slice(0, 3)
            .map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleDotClick(testimonials.indexOf(testimonial))}
              >
                {/* Mini Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Mini Text */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  "{testimonial.text}"
                </p>

                {/* Mini Customer Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900">
                      {testimonial.name}
                    </h5>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">1000+</p>
              <p className="text-red-100">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">5000+</p>
              <p className="text-red-100">Orders Delivered</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">4.9★</p>
              <p className="text-red-100">Average Rating</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">100%</p>
              <p className="text-red-100">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;