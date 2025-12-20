// MenuManager.jsx - With react-hot-toast
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddMenuItem from './AddMenuItem';

const MenuManager = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');

  // Get API URL from environment or use default
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.error('No admin token found');
      toast.error('Please login as admin');
      navigate('/admin/secure-access');
      return;
    }
    fetchMenuItems();
  }, []);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Session expired. Please login again.');
      navigate('/admin/secure-access');
      throw new Error('No admin token');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/menu`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        console.error('Unauthorized - redirecting to login');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        toast.error('Session expired. Please login again.');
        setTimeout(() => navigate('/admin/secure-access'), 1500);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.data || []);
      } else {
        console.error('Failed to fetch menu:', response.status);
        toast.error('Failed to load menu items');
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      if (error.message === 'No admin token') {
        return; // Already redirected
      }
      toast.error('Error loading menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (formData) => {
    const loadingToast = toast.loading('Adding menu item...');
    
    try {
      const response = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      toast.dismiss(loadingToast);

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setTimeout(() => navigate('/admin/secure-access'), 1500);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Menu item added successfully!');
        fetchMenuItems();
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add menu item');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error adding item:', err);
      toast.error('Error adding menu item. Please try again.');
    }
  };

  const handleEditItem = async (formData) => {
    const loadingToast = toast.loading('Updating menu item...');
    
    try {
      const response = await fetch(`${API_URL}/menu/${editingItem._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      toast.dismiss(loadingToast);

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setTimeout(() => navigate('/admin/secure-access'), 1500);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Menu item updated successfully!');
        fetchMenuItems();
        setIsModalOpen(false);
        setEditingItem(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update menu item');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error updating item:', err);
      toast.error('Error updating menu item. Please try again.');
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/menu/${id}/availability`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setTimeout(() => navigate('/admin/secure-access'), 1500);
        return;
      }

      if (response.ok) {
        toast.success('Availability updated!');
        fetchMenuItems();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to toggle availability');
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
      toast.error('Error toggling availability. Please try again.');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    const loadingToast = toast.loading('Deleting menu item...');
    
    try {
      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      toast.dismiss(loadingToast);

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setTimeout(() => navigate('/admin/secure-access'), 1500);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Menu item deleted successfully!');
        fetchMenuItems();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete menu item');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Error deleting item:', err);
      toast.error('Error deleting menu item. Please try again.');
    }
  };

  const filteredItems =
    filter === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
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
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
              className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-colors ${
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
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={item.image || 'https://placehold.co/300x200/e5e7eb/6b7280?text=No+Image'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/300x200/e5e7eb/6b7280?text=No+Image';
                  }}
                />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Unavailable</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {item.category.replace('-', ' ')}
                    </p>
                  </div>
                  <span
                    className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${
                      item.isVeg
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                  >
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-red-600">
                    ₹{item.price}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.preparationTime || 15} min
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleAvailability(item._id, item.isAvailable)}
                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 border rounded-lg font-medium transition-colors ${
                      item.isAvailable
                        ? 'border-yellow-500 text-yellow-700 hover:bg-yellow-50'
                        : 'border-green-500 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {item.isAvailable ? (
                      <>
                        <EyeOff size={16} />
                        <span className="text-sm">Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        <span className="text-sm">Show</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 font-medium transition-colors"
                  >
                    <Edit size={16} />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="flex items-center justify-center px-3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-medium transition-colors"
                    title="Delete item"
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