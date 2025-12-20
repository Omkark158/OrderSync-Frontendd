// components/order/MenuItemCard.jsx - Fixed with proper context usage
import { ShoppingCart } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useOrder();

  const handleAddToCart = () => {
    addToCart(item);
    // Dispatch custom event for immediate UI update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={item.image || 'https://via.placeholder.com/300x200?text=Sachin+Foods'}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Sachin+Foods';
          }}
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Unavailable
            </span>
          </div>
        )}
        {item.isVeg && (
          <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Veg
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
          <span className="text-red-600 font-bold text-lg whitespace-nowrap ml-2">
            ₹{item.price}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {item.preparationTime || 15} min
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded capitalize">
            {item.category.replace('-', ' ')}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!item.isAvailable}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          {item.isAvailable ? 'Add to Cart' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;