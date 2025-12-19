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
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
          fontSize: '16px',
          maxWidth: '500px',
          padding: '16px',
          borderRadius: '8px',
        },
        success: {
          style: {
            background: '#10b981',
          },
          icon: '✅',
        },
        error: {
          style: {
            background: '#ef4444',
          },
          icon: '❌',
        },
      }}
    />
  </React.StrictMode>
);