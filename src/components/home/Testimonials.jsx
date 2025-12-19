// src/components/home/Testimonials.jsx
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Anita Rajan",
      location: "Kundara",
      text: "Best Chappathy and Appam in town! We ordered for a family function and everyone loved it. Fresh and authentic taste.",
      rating: 5
    },
    {
      name: "Suresh Kumar",
      location: "Kollam",
      text: "Excellent service! Ordered Pathiri and bakery items for an event. Delivered on time and food was hot and delicious.",
      rating: 5
    },
    {
      name: "Priya Menon",
      location: "Kundara",
      text: "Highly recommend Sachin Foods! Their advance ordering system is perfect for planning parties. Thank you!",
      rating: 5
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600">
            Loved by families across Kundara & Kollam
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-10 shadow-xl relative">
            {/* Stars */}
            <div className="flex justify-center mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-500 fill-current" />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-xl md:text-2xl text-gray-800 text-center italic mb-8 leading-relaxed">
              "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{testimonial.name}</p>
              <p className="text-gray-600">{testimonial.location}</p>
            </div>

            {/* Navigation */}
            <button
              onClick={prev}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition"
            >
              <ChevronLeft size={28} className="text-red-600" />
            </button>
            <button
              onClick={next}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition"
            >
              <ChevronRight size={28} className="text-red-600" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === current ? 'bg-red-600 w-10' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;