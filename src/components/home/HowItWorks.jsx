// src/components/home/HowItWorks.jsx
import { Calendar, ShoppingCart, CheckCircle, Truck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: ShoppingCart,
      title: 'Browse Menu',
      description: 'Explore our wide selection of authentic Kerala dishes including Chappathy, Appam, Pathiri and more',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Select Date & Time',
      description: 'Choose your preferred delivery date and time for your event or celebration',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      number: '03',
      icon: CheckCircle,
      title: 'Place Order',
      description: 'Add items to cart, review your order and confirm with advance payment',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      number: '04',
      icon: Truck,
      title: 'Get Delivered',
      description: 'Receive fresh, hot food delivered right on time to your doorstep',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It
            <span className="text-red-600"> Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Order your favorite food in just 4 simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-blue-200 via-green-200 to-orange-200 -z-10"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative"
            >
              {/* Card */}
              <div className={`${step.bgColor} rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col`}>
                {/* Step Number */}
                <div className="inline-block mx-auto mb-6">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                    <step.icon size={32} className={`bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} style={{
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundImage: `linear-gradient(to bottom right, ${step.color})`,
                    }} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed flex-grow">
                  {step.description}
                </p>
              </div>

              {/* Connecting Arrow (Mobile) */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center my-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Ready to get started?
                </h3>
                <p className="text-gray-600">
                  Create your account and start ordering delicious food today!
                </p>
              </div>
              <button className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors whitespace-nowrap">
                Sign Up Free
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <p className="text-3xl font-bold text-red-600 mb-2">24/7</p>
            <p className="text-gray-600">Customer Support</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <p className="text-3xl font-bold text-red-600 mb-2">100%</p>
            <p className="text-gray-600">Quality Guaranteed</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <p className="text-3xl font-bold text-red-600 mb-2">Fast</p>
            <p className="text-gray-600">On-Time Delivery</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;