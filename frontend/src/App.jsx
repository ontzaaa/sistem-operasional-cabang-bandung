import React, { useState } from 'react';
import LoginForm from './component/Login/LoginForm';
import Register from './component/Register/Register';
import Dashboard from './component/Dashboard/Dashboard';
import './App.css';

export default function App() {
  // Halaman default saat aplikasi dibuka: 'login'
  const [currentPage, setCurrentPage] = useState('login');
  const [successInfo, setSuccessInfo] = useState('');
  const [user, setUser] = useState({
    name: 'Andi Wijaya',
    role: 'Operasional Gudang & Penjualan',
    branch: 'Cabang Bandung',
    idNumber: 'KRY - 0024',
    email: 'andi.wijaya@solomurni.co.id',
    phone: '+62 812-3456-7890',
    department: 'Penjualan & Gudang'
  });

  const handleNavigateToLogin = (payload) => {
    setCurrentPage('login');
    if (payload?.message) {
      setSuccessInfo(payload.message);
    }
  };

  const handleLoginSuccess = (userData) => {
    if (userData) {
      setUser((prev) => ({ ...prev, ...userData }));
    }
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Render Halaman Sesuai State */}
      {currentPage === 'register' && (
        <Register
          onNavigateToLogin={handleNavigateToLogin}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'login' && (
        <LoginForm
          onNavigateToRegister={() => {
            setCurrentPage('register');
            setSuccessInfo('');
          }}
          onSwitchToRegister={() => {
            setCurrentPage('register');
            setSuccessInfo('');
          }}
          onLoginSuccess={handleLoginSuccess}
          successMessage={successInfo}
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          user={user}
          initialMenu="dashboard"
          onLogout={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'pengaturan' && (
        <Dashboard
          user={user}
          initialMenu="pengaturan"
          onLogout={() => setCurrentPage('login')}
        />
      )}
    </div>
  );
}
