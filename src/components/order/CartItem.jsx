// ============================================
// 2. CartItem.jsx - Individual Cart Item
// ============================================
import { Plus, Minus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={item.image || 'https://via.placeholder.com/100'}
          alt={item.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Details */}
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
        <p className="text-sm text-gray-500 mt-1">₹{item.price} per item</p>
        <div className="flex items-center gap-2 mt-2">
          {item.isVeg && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Veg</span>
          )}
          <span className="text-xs text-gray-500">Prep: {item.preparationTime || 15} min</span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Minus size={16} />
        </button>
        <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Price & Remove */}
      <div className="flex flex-col items-end gap-2">
        <p className="font-bold text-xl text-gray-900">
          ₹{(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => onRemove(item._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;