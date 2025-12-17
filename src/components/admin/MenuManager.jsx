// 3. MenuManager.jsx
// ============================================
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import AddMenuItem from './AddMenuItem';

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      // Replace with your API call
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenuItems(data.data || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (formData) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchMenuItems();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = async (formData) => {
    try {
      const response = await fetch(`/api/menu/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchMenuItems();
        setIsModalOpen(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/menu/${id}/availability`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchMenuItems();
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchMenuItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems =
    filter === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Menu Manager</h1>
          <p className="text-gray-600 mt-1">
            Manage your food items and categories
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus size={20} />
          Add New Item
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'starters', 'main-course', 'desserts', 'beverages', 'special'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
                filter === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat.replace('-', ' ')}
            </button>
          )
        )}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No items found. Add your first menu item!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Image */}
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={item.image || 'https://via.placeholder.com/300x200'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold">Unavailable</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {item.category.replace('-', ' ')}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      item.isVeg
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-red-600">
                    ₹{item.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.preparationTime} min
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleAvailability(item._id, item.isAvailable)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    {item.isAvailable ? (
                      <>
                        <Eye size={16} />
                        <span className="text-sm">Hide</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={16} />
                        <span className="text-sm">Show</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                  >
                    <Edit size={16} />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="flex items-center justify-center px-3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddMenuItem
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleEditItem : handleAddItem}
        initialData={editingItem}
      />
    </div>
  );
};

export default MenuManager;