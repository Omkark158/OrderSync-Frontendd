// ============================================
// 4. MenuItemCard.jsx - Menu Item Display Card
// ============================================
import { Plus, ShoppingCart } from 'lucide-react';

const MenuItemCard = ({ item, onAddToCart }) => {
  const handleAddToCart = () => {
    // Get existing cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex(cartItem => cartItem._id === item._id);
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      cart.push({ ...item, quantity: 1 });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Callback
    if (onAddToCart) onAddToCart(item);
    
    // Show feedback
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={item.image || 'https://via.placeholder.com/300x200'}
          alt={item.name}
          className="w-full h-full object-cover"
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
          <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
          <span className="text-red-600 font-bold text-lg">₹{item.price}</span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">
            ⏱️ {item.preparationTime || 15} min
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
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;