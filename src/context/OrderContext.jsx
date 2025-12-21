// context/OrderContext.jsx - COMPLETE with all functions
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

  // Load cart from localStorage on mount
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
    }
    
    setCartLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!cartLoading) {
      console.log('💾 Saving cart to localStorage:', cart);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, cartLoading]);

  // Cart Helper Functions
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGST = () => {
    const subtotal = getCartTotal();
    return (subtotal * 5) / 100;
  };

  const getFinalTotal = () => {
    return getCartTotal() + calculateGST();
  };

  // Add item to cart
  const addToCart = (item) => {
    console.log('➕ Adding to cart:', item);
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem._id === item._id);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        toast.success(`${item.name} quantity updated!`);
        return updatedCart;
      } else {
        toast.success(`${item.name} added to cart!`);
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i._id === itemId);
      if (item) {
        toast.success(`${item.name} removed from cart`);
      }
      return prevCart.filter((item) => item._id !== itemId);
    });
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
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

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  // Create order
  const createOrder = async (orderData) => {
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

      console.log('📝 Creating order:', orderData);

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

  // ✅ Fetch user orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to view orders');
        return { success: false, message: 'Authentication required' };
      }

      console.log('📡 Fetching orders...');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📦 Orders fetched:', data);

      if (data.success) {
        setOrders(data.data || []);
        return { success: true, orders: data.data };
      } else {
        toast.error(data.message || 'Failed to fetch orders');
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to fetch orders');
      return { success: false, message: 'Failed to fetch orders' };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single order
  const fetchOrderById = async (orderId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCurrentOrder(data.data);
        return { success: true, order: data.data };
      } else {
        toast.error(data.message || 'Failed to fetch order');
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Fetch order error:', error);
      toast.error('Failed to fetch order');
      return { success: false, message: 'Failed to fetch order' };
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId, reason) => {
    setLoading(true);
    const loadingToast = toast.loading('Cancelling order...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        setOrders(orders.map((order) =>
          order._id === orderId ? data.data : order
        ));
        toast.success('Order cancelled successfully');
        return { success: true, order: data.data };
      } else {
        toast.error(data.message || 'Failed to cancel order');
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to cancel order');
      return { success: false, message: 'Failed to cancel order' };
    } finally {
      setLoading(false);
    }
  };

  // Download invoice
  const downloadInvoice = async (orderId) => {
    const loadingToast = toast.loading('Preparing invoice...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/invoices/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success && data.data) {
        window.open(`/api/invoices/${data.data._id}/download`, '_blank');
        toast.success('Invoice opened in new tab');
        return { success: true };
      } else {
        toast.error('Invoice not available yet');
        return { success: false, message: 'Invoice not available yet' };
      }
    } catch (error) {
      console.error('Download invoice error:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to download invoice');
      return { success: false, message: 'Failed to download invoice' };
    }
  };

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