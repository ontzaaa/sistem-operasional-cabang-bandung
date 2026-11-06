import React, { useState } from 'react';
import LoginForm from './component/Login/LoginForm';
import Register from './component/Register/Register';
import './App.css';

export default function App() {
  // Ditampilkan Register terlebih dahulu sesuai permintaan pengguna
  const [isLogin, setIsLogin] = useState(false);
  const [successInfo, setSuccessInfo] = useState('');

  const handleNavigateToLogin = (payload) => {
    setIsLogin(true);
    if (payload?.message) {
      setSuccessInfo(payload.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {isLogin ? (
        <LoginForm
          onNavigateToRegister={() => {
            setIsLogin(false);
            setSuccessInfo('');
          }}
          onSwitchToRegister={() => {
            setIsLogin(false);
            setSuccessInfo('');
          }}
          successMessage={successInfo}
        />
      ) : (
        <Register
          onNavigateToLogin={handleNavigateToLogin}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
}
