// src/components/menu/MenuItem.jsx
import { Star, Clock } from 'lucide-react';

const MenuItem = ({ item, onAddToCart }) => {
  const handleAddClick = () => {
    onAddToCart(item);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image || 'https://via.placeholder.com/400x300?text=Food+Item'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {item.discount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {item.discount}% OFF
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            item.isVeg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {item.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>

        {/* Availability Badge */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
              Not Available
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-red-600 font-semibold uppercase tracking-wide">
          {item.category?.replace('-', ' ')}
        </span>

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-red-600">
              ₹{item.price}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{item.originalPrice}
              </span>
            )}
          </div>
          
          {item.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">
                {item.rating}
              </span>
            </div>
          )}
        </div>

        {/* Preparation Time */}
        {item.preparationTime && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <Clock size={14} />
            <span>{item.preparationTime} min</span>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddClick}
          disabled={!item.isAvailable}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default MenuItem;