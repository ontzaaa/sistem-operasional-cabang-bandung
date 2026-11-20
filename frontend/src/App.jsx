import React, { useState } from 'react'
import LandingPage from './component/Landing page/landing'
import LoginForm from './component/Login/LoginForm'
import Register from './component/Register/Register'
import Dashboard from './component/Dashboard/Dashboard'
import './App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [successInfo, setSuccessInfo] = useState('')
  const [registeredUsername, setRegisteredUsername] = useState('')
  const [user, setUser] = useState(null)

  const handleNavigateToLogin = (payload) => {
    if (payload?.username) setRegisteredUsername(payload.username)
    if (payload?.message) setSuccessInfo(payload.message)
    setCurrentPage('login')
  }

  const handleLoginSuccess = (userData) => {
    const divisionNames = {
      penjualan: 'Penjualan',
      gudang: 'Gudang',
      admin: 'Admin',
    }
    const joinedDate = userData?.created_at
      ? new Date(userData.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'Belum diisi'
    const division = divisionNames[userData?.divisi] || userData?.divisi || 'Belum diisi'

    setUser({
      id: userData?.id,
      name: userData?.nama_lengkap || userData?.username || 'Belum diisi',
      role: userData?.jabatan || 'Belum diisi',
      branch: userData?.cabang || 'Belum diisi',
      idNumber: userData?.id ? `KRY - ${String(userData.id).padStart(4, '0')}` : 'Belum diisi',
      email: userData?.email || 'Belum diisi',
      phone: userData?.no_telepon || 'Belum diisi',
      location: userData?.domisili || 'Belum diisi',
      department: division,
      mainBranch: userData?.cabang || 'Belum diisi',
      manager: userData?.atasan_langsung || 'Belum diisi',
      joinDate: joinedDate,
      token: userData?.token,
    })
    setSuccessInfo('')
    setCurrentPage('dashboard')
  }

  return (
    <div className="relative min-h-screen bg-slate-50">
      {currentPage === 'landing' && <LandingPage onEnterSystem={() => setCurrentPage('login')} />}

      {currentPage === 'register' && (
        <Register onNavigateToLogin={handleNavigateToLogin} onSwitchToLogin={handleNavigateToLogin} />
      )}

      {currentPage === 'login' && (
        <LoginForm
          initialUsername={registeredUsername}
          onNavigateToRegister={() => {
            setSuccessInfo('')
            setCurrentPage('register')
          }}
          onLoginSuccess={handleLoginSuccess}
          successMessage={successInfo}
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard user={user} initialMenu="dashboard" onLogout={() => setCurrentPage('login')} />
      )}

      {currentPage === 'pengaturan' && (
        <Dashboard user={user} initialMenu="pengaturan" onLogout={() => setCurrentPage('login')} />
      )}
    </div>
  )
}