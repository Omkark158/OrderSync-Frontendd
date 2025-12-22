// src/components/home/HowItWorks.jsx - With hover shadow cards
import { ShoppingCart, Calendar, CreditCard, Truck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      color: 'bg-red-600',
      hoverColor: 'group-hover:bg-red-700',
      icon: ShoppingCart,
      title: 'Browse Menu',
      description: 'Explore our wide selection of authentic Kerala dishes',
    },
    {
      number: '02',
      color: 'bg-blue-600',
      hoverColor: 'group-hover:bg-blue-700',
      icon: Calendar,
      title: 'Select Date & Time',
      description: 'Choose your preferred delivery date and time',
    },
    {
      number: '03',
      color: 'bg-green-600',
      hoverColor: 'group-hover:bg-green-700',
      icon: CreditCard,
      title: 'Place Order',
      description: 'Add items to cart and confirm with advance payment',
    },
    {
      number: '04',
      color: 'bg-orange-600',
      hoverColor: 'group-hover:bg-orange-700',
      icon: Truck,
      title: 'Get Delivered',
      description: 'Receive fresh, hot food delivered on time',
    },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          How It <span className="text-red-600">Works</span>
        </h2>
        <p className="text-xl text-gray-600 mb-16">
          Order your favorite food in just 4 simple steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gray-300 -translate-y-1/2 z-0" />
              )}

              <div className="relative z-10 bg-white rounded-xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className={`${step.color} ${step.hoverColor} text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg transition-all duration-300 group-hover:scale-110`}>
                  {step.number}
                </div>
                <step.icon className="w-16 h-16 text-gray-700 mx-auto mb-6 group-hover:text-red-600 transition-colors duration-300 group-hover:scale-110" />
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;