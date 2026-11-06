import { useState } from 'react'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react'
import bgWarehouse from '../../assets/Images/background.jpeg'

export default function LoginForm({
  onNavigateToRegister,
  onLoginSuccess,
  initialUsername = '',
  successMessage = ''
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [formData, setFormData] = useState({
    username: initialUsername,
    password: ''
  })

  // State Loading Validasi Akun
  const [isValidating, setIsValidating] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.username.trim() || !formData.password.trim()) {
      return
    }

    setIsValidating(true)

    // Simulasi verifikasi login
    setTimeout(() => {
      setIsValidating(false)
      if (onLoginSuccess) {
        onLoginSuccess({
          name: formData.username || 'Andi Wijaya',
          role: 'Sales Supervisor'
        })
      } else {
        alert(`Login Berhasil!\nUsername: ${formData.username}`)
      }
    }, 850)
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between items-center bg-slate-950 font-sans text-slate-800 antialiased overflow-hidden selection:bg-[#0e355c] selection:text-white">
      {/* Background Gambar Gudang Fullscreen */}
      <img
        src={bgWarehouse}
        alt="Gudang PT Solo Murni KIKY"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Dark Vignette & Gradient Overlay */}
      <div className="absolute inset-0 bg-[#071c30]/75 bg-gradient-to-t from-[#041220]/95 via-[#071c30]/70 to-[#071c30]/65 backdrop-blur-[2px]" />

      {/* Spacing Atas */}
      <div className="h-4" />

      {/* Center Container: Card Login */}
      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center px-4 py-6">
        <div className="w-full rounded-3xl border border-slate-100/80 bg-white/95 p-7 sm:p-9 shadow-2xl backdrop-blur-md">
          {/* Header Logo KIKY */}
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center justify-center rounded-full border-2 border-black px-4 py-1 tracking-wider">
              <span className="text-xs font-black tracking-widest text-black">KIKY</span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#0f2b48]">
              Masuk Akun
            </h2>
            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              Aplikasi Operasional Gudang &amp; Penjualan KIKY
            </p>
          </div>

          {/* Notifikasi Sukses Pendaftaran jika diarahkan dari Register */}
          {successMessage && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50 p-3.5 text-xs text-emerald-800 shadow-xs">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-[11px]">✓</span>
              <p className="font-medium leading-snug">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field Username */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={isValidating}
                  className="w-full rounded-xl border border-slate-200/90 bg-white py-3 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0e355c] focus:outline-none focus:ring-2 focus:ring-[#0e355c]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Field Kata Sandi */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isValidating}
                  className="w-full rounded-xl border border-slate-200/90 bg-white py-3 pr-10 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0e355c] focus:outline-none focus:ring-2 focus:ring-[#0e355c]/10 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Ingat Saya & Lupa Kata Sandi */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isValidating}
                  className="h-4 w-4 rounded border-slate-300 text-[#0e355c] focus:ring-[#0e355c] cursor-pointer"
                />
                <span>Ingat Saya</span>
              </label>
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Silakan hubungi administrator IT untuk reset kata sandi.')
                }}
                className="font-semibold text-[#0e355c] hover:underline transition-colors"
              >
                Lupa Kata Sandi?
              </a>
            </div>

            {/* Tombol Submit Masuk ke Sistem */}
            <button
              type="submit"
              disabled={isValidating}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0e355c] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#0e355c]/20 transition-all duration-200 hover:bg-[#092542] hover:shadow-lg active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{isValidating ? 'Memproses...' : 'Masuk ke Sistem'}</span>
              {!isValidating && <ArrowRight className="h-4 w-4" />}
            </button>

            {/* Link Register */}
            <div className="pt-3 text-center text-xs text-slate-600">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                disabled={isValidating}
                className="font-bold text-[#0f2b48] hover:underline cursor-pointer disabled:opacity-50"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Pop Up Loading Verifikasi Akun Standar (Simpel & Natural) */}
      {isValidating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="flex w-full max-w-[240px] flex-col items-center justify-center rounded-2xl bg-white px-6 py-6 shadow-xl border border-slate-100">
            <div className="h-8 w-8 rounded-full border-[3px] border-slate-200 border-t-[#0e355c] animate-spin" />
            <p className="mt-3.5 text-xs font-semibold text-slate-800">Memverifikasi akun</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Mohon tunggu...</p>
          </div>
        </div>
      )}

      {/* Footer Hak Cipta di Bawah */}
      <footer className="relative z-10 w-full pb-4 text-center text-[11px] text-slate-300/80">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-white">PT SOLO MURNI CAB. BANDUNG</span>. Hak Cipta Dilindungi.
      </footer>
    </div>
  )
}
