// src/components/home/Features.jsx
import { Award, Clock, PhoneCall } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Award,
      title: 'Fresh & Authentic',
      description: 'Traditional Kerala recipes made with love using fresh, high-quality ingredients daily.',
    },
    {
      icon: Clock,
      title: 'Advance Ordering',
      description: 'Plan ahead for events and celebrations. Order Chappathy, Appam, Pathiri & more in advance.',
    },
    {
      icon: PhoneCall,
      title: '24/7 Support',
      description: 'Call us anytime at 9539387240 or 9388808825 for orders, inquiries, or special requests.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Sachin Foods?
          </h2>
          <p className="text-xl text-gray-600">
            Homemade taste, delivered with care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 group-hover:bg-red-600 transition-colors">
                <feature.icon className="w-10 h-10 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;