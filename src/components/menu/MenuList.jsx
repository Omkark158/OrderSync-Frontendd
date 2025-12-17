// src/components/menu/MenuList.jsx
import { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import MenuFilter from './MenuFilter';

const MenuList = ({ onAddToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, veg, non-veg
  const [loading, setLoading] = useState(true);

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      
      if (data.success) {
        setMenuItems(data.data || []);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(data.data.map(item => item.category))];
        const categoryOptions = uniqueCategories.map(cat => ({
          value: cat,
          label: cat === 'all' ? 'All' : cat.replace('-', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
        }));
        setCategories(categoryOptions);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on category, search, and veg/non-veg filter
  useEffect(() => {
    let filtered = menuItems;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Veg/Non-veg filter
    if (filter === 'veg') {
      filtered = filtered.filter(item => item.isVeg === true);
    } else if (filter === 'non-veg') {
      filtered = filtered.filter(item => item.isVeg === false);
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery, filter, menuItems]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Component */}
      <MenuFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Results Count */}
      <div className="text-gray-600">
        Showing <span className="font-semibold">{filteredItems.length}</span> items
        {searchQuery && ` for "${searchQuery}"`}
      </div>

      {/* Menu Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItem 
              key={item._id} 
              item={item} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No items found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuList;