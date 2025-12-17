// src/components/home/Features.jsx
import { Calendar, Clock, Shield, Sparkles, Truck, UtensilsCrossed } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Pre-Order System',
      description: 'Order in advance for your events, parties, and special occasions',
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      icon: Clock,
      title: 'Timely Delivery',
      description: 'Fresh food delivered exactly when you need it, guaranteed on time',
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-200',
    },
    {
      icon: UtensilsCrossed,
      title: 'Authentic Taste',
      description: 'Traditional Kerala recipes made with authentic ingredients',
      color: 'bg-red-100 text-red-600',
      borderColor: 'border-red-200',
    },
    {
      icon: Sparkles,
      title: 'Fresh & Hygienic',
      description: 'Prepared fresh daily in our clean, modern kitchen facilities',
      color: 'bg-yellow-100 text-yellow-600',
      borderColor: 'border-yellow-200',
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Premium quality ingredients with strict quality control',
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      icon: Truck,
      title: 'Wide Coverage',
      description: 'Serving Kundara, Kollam and surrounding areas',
      color: 'bg-orange-100 text-orange-600',
      borderColor: 'border-orange-200',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose
            <span className="text-red-600"> Sachin Foods</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We combine tradition with technology to bring you the best food ordering experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-8 rounded-2xl border-2 ${feature.borderColor} bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={32} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8">
            <p className="text-lg text-gray-700 mb-4">
              Ready to experience authentic Kerala cuisine?
            </p>
            <button className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;