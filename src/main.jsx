import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* Global Toaster — shows toasts from anywhere in app */}
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default duration - 3 seconds instead of 4
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
          duration: 2000, // Success messages disappear faster
          style: {
            background: '#10b981',
          },
          icon: '✅',
        },
        error: {
          duration: 3000, // Error messages stay a bit longer
          style: {
            background: '#ef4444',
          },
          icon: '❌',
        },
        loading: {
          duration: Infinity, // Loading toasts stay until dismissed
          style: {
            background: '#3b82f6',
          },
          icon: '⏳',
        },
      }}
    />
  </React.StrictMode>
);