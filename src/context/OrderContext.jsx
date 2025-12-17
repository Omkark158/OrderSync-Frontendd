// ============================================
// 2. OrderContext.jsx - Order Management Context
// ============================================
import { createContext, useContext, useState, useEffect } from 'react';

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

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cart]);

  // Add item to cart
  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem._id === item._id);

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item with quantity 1
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item._id === itemId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Get cart item count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Calculate GST
  const calculateGST = () => {
    const subtotal = getCartTotal();
    return (subtotal * 5) / 100; // 5% GST
  };

  // Get final total with GST
  const getFinalTotal = () => {
    return getCartTotal() + calculateGST();
  };

  // Create order
  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Prepare order items from cart
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

      if (data.success) {
        setCurrentOrder(data.data);
        clearCart(); // Clear cart after successful order
        return { success: true, order: data.data };
      } else {
        return { success: false, message: data.message || 'Failed to create order' };
      }
    } catch (error) {
      console.error('Create order error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Fetch user orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
        return { success: true, orders: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
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
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Fetch order error:', error);
      return { success: false, message: 'Failed to fetch order' };
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId, reason) => {
    setLoading(true);
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

      if (data.success) {
        // Update orders list
        setOrders(orders.map((order) =>
          order._id === orderId ? data.data : order
        ));
        return { success: true, order: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      return { success: false, message: 'Failed to cancel order' };
    } finally {
      setLoading(false);
    }
  };

  // Download invoice
  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/invoices/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Open PDF in new tab
        window.open(`/api/invoices/${data.data._id}/download`, '_blank');
        return { success: true };
      } else {
        return { success: false, message: 'Invoice not available yet' };
      }
    } catch (error) {
      console.error('Download invoice error:', error);
      return { success: false, message: 'Failed to download invoice' };
    }
  };

  const value = {
    cart,
    orders,
    currentOrder,
    loading,
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

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export default OrderContext;