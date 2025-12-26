// src/App.jsx - COMPLETE with all routes including InvoiceViewer
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import AdminMenuManager from './components/admin/MenuManager';
import OrderManager from './components/admin/OrderManager';
import InvoiceViewer from './components/admin/InvoiceViewer';
import AdminInvoices from './components/admin/AdminInvoices';
import AdminProfile from './pages/admin/AdminProfile'; 


// Payment
import PaymentSuccess from './components/payment/PaymentSuccess';

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          {/* Toast Notifications - Global */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                fontSize: '16px',
                maxWidth: '500px',
                padding: '16px',
                borderRadius: '8px',
              },
              success: {
                duration: 2000,
                style: {
                  background: '#10b981',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10b981',
                },
              },
              error: {
                duration: 3000,
                style: {
                  background: '#ef4444',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#ef4444',
                },
              },
              loading: {
                duration: Infinity,
                style: {
                  background: '#3b82f6',
                },
              },
            }}
          />

          <Routes>
            {/* Public User Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Hidden Admin Login */}
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
                <AdminMenuManager />
              </AdminRoute>
            } />

            {/* ✅ Invoice Viewer Route */}
            <Route path="/admin/invoices/:invoiceId" element={
              <AdminRoute>
                <InvoiceViewer />
              </AdminRoute>
            } />


            <Route path="/admin/invoices" element={
              <AdminRoute>
                <AdminInvoices />
              </AdminRoute>
            } />

            <Route path="/admin/invoices/:invoiceId" element={
              <AdminRoute>
                <InvoiceViewer />
              </AdminRoute>
            } />

            <Route path="/admin/profile" element={
              <AdminRoute>
                <AdminProfile />
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