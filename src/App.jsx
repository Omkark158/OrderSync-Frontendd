// src/App.jsx - FINAL: ONLY ONE HIDDEN ADMIN LOGIN URL
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import Layout from './components/common/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

// User Pages
import Home from './pages/user/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import MenuPage from './pages/user/MenuPage';
import CartPage from './pages/user/CartPage';
import CreateOrder from './pages/user/CreateOrder';
import OrderHistory from './pages/user/OrderHistory';
import Profile from './pages/user/Profile';
import Bill from './pages/user/Bill';
import NotFound from './pages/user/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './components/admin/AdminOrders';
import MenuManager from './components/admin/MenuManager';
import OrderManager from './components/admin/OrderManager';

// Payment
import PaymentSuccess from './components/payment/PaymentSuccess';

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          <Routes>
            {/* Public User Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ONLY ONE ADMIN LOGIN URL - HIDDEN & LOOKS LIKE API */}
            {/* Change this line in App.jsx */}
            <Route path="/admin/secure-access" element={<AdminLogin />} />

            {/* User Routes with Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />

              <Route path="/menu" element={
                <PrivateRoute>
                  <MenuPage />
                </PrivateRoute>
              } />
              <Route path="/cart" element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              } />
              <Route path="/create-order" element={
                <PrivateRoute>
                  <CreateOrder />
                </PrivateRoute>
              } />
              <Route path="/orders" element={
                <PrivateRoute>
                  <OrderHistory />
                </PrivateRoute>
              } />
              <Route path="/orders/:orderId" element={
                <PrivateRoute>
                  <OrderManager />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/bill/:orderId" element={
                <PrivateRoute>
                  <Bill />
                </PrivateRoute>
              } />
              <Route path="/payment-success" element={
                <PrivateRoute>
                  <PaymentSuccess />
                </PrivateRoute>
              } />
            </Route>

            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } />
            <Route path="/admin/orders/:orderId" element={
              <AdminRoute>
                <OrderManager />
              </AdminRoute>
            } />
            <Route path="/admin/menu" element={
              <AdminRoute>
                <MenuManager />
              </AdminRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;