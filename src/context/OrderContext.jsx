// context/OrderContext.jsx - FIXED: No more infinite loop
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);

  // ============================================
  // 1. Load cart from localStorage on mount
  // ============================================
  useEffect(() => {
    console.log('🔄 Loading cart from localStorage...');
    const storedCart = localStorage.getItem('cart');
    
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        console.log('✅ Cart loaded:', parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('❌ Error loading cart:', error);
        localStorage.removeItem('cart');
      }
    } else {
      console.log('ℹ️ No cart in localStorage');
    }
    
    setCartLoading(false);
  }, []);

  // ============================================
  // 2. Save cart to localStorage whenever it changes
  // ============================================
  useEffect(() => {
    if (!cartLoading) {
      console.log('💾 Saving cart to localStorage:', cart);
      localStorage.setItem('cart', JSON.stringify(cart));
      // REMOVED: dispatchEvent — no longer needed (was causing infinite loop)
    }
  }, [cart, cartLoading]);

  // ============================================
  // 3. Listen for storage changes (cross-tab sync) — KEEP THIS
  // ============================================
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        console.log('📦 Cart updated in another tab');
        const updatedCart = e.newValue ? JSON.parse(e.newValue) : [];
        setCart(updatedCart);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ============================================
  // 4. REMOVED: Custom event listener (was causing infinite loop)
  // ============================================
  // Deleted entirely — React Context already handles same-tab updates instantly

  // ============================================
  // Cart Helper Functions
  // ============================================

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartTotal = () => {
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return total;
  };

  const calculateGST = () => {
    const subtotal = getCartTotal();
    return (subtotal * 5) / 100; // 5% GST
  };

  const getFinalTotal = () => {
    return getCartTotal() + calculateGST();
  };

  // ============================================
  // Add item to cart
  // ============================================
  const addToCart = (item) => {
    console.log('➕ Adding to cart:', item);
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem._id === item._id);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        console.log('✅ Updated quantity for existing item');
        toast.success(`${item.name} quantity updated!`);
        return updatedCart;
      } else {
        console.log('✅ Added new item to cart');
        toast.success(`${item.name} added to cart!`);
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // ============================================
  // Remove item from cart
  // ============================================
  const removeFromCart = (itemId) => {
    console.log('🗑️ Removing from cart:', itemId);
    setCart(prevCart => {
      const item = prevCart.find(i => i._id === itemId);
      if (item) {
        toast.success(`${item.name} removed from cart`);
      }
      return prevCart.filter((item) => item._id !== itemId);
    });
  };

  // ============================================
  // Update item quantity
  // ============================================
  const updateQuantity = (itemId, quantity) => {
    console.log('🔄 Updating quantity:', itemId, quantity);
    
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => {
      return prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      );
    });
  };

  // ============================================
  // Clear entire cart
  // ============================================
  const clearCart = () => {
    console.log('🧹 Clearing cart');
    setCart([]);
    // localStorage.removeItem('cart'); → already handled by the save effect
    toast.success('Cart cleared');
  };

  // ============================================
  // Create order (unchanged)
  // ============================================
  const createOrder = async (orderData) => {
    // ... (same as before)
    setLoading(true);
    const loadingToast = toast.loading('Creating your order...');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.dismiss(loadingToast);
        toast.error('Please login to place order');
        return { success: false, message: 'Authentication required' };
      }

      if (cart.length === 0) {
        toast.dismiss(loadingToast);
        toast.error('Your cart is empty');
        return { success: false, message: 'Cart is empty' };
      }
      
      const orderItems = cart.map((item) => ({
        menuItem: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...orderData,
          orderItems,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        setCurrentOrder(data.data);
        clearCart();
        
        // Admin SMS notification
        try {
          await fetch('/api/sms/admin-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderNumber: data.data.orderNumber,
              customerName: data.data.customerName,
              totalAmount: data.data.totalAmount,
              orderDateTime: data.data.orderDateTime,
            }),
          });
        } catch (error) {
          console.error('❌ Admin notification failed:', error);
        }
        
        toast.success('🎉 Order placed successfully!');
        return { success: true, order: data.data };
      } else {
        toast.error(data.message || 'Failed to create order');
        return { success: false, message: data.message || 'Failed to create order' };
      }
    } catch (error) {
      console.error('❌ Create order error:', error);
      toast.dismiss(loadingToast);
      toast.error('Network error. Please check your connection.');
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // fetchOrders, fetchOrderById, cancelOrder, downloadInvoice remain exactly the same
  // (copy-paste them from your original file — no changes needed)

  const fetchOrders = async () => { /* ... same as before */ };
  const fetchOrderById = async (orderId) => { /* ... same as before */ };
  const cancelOrder = async (orderId, reason) => { /* ... same as before */ };
  const downloadInvoice = async (orderId) => { /* ... same as before */ };

  const value = {
    cart,
    orders,
    currentOrder,
    loading,
    cartLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    calculateGST,
    getFinalTotal,
    createOrder,
    fetchOrders,
    fetchOrderById,
    cancelOrder,
    downloadInvoice,
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export default OrderContext;