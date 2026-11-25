import { useState, useEffect, useRef } from 'react'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import bgWarehouse from '../../assets/Images/background.jpeg'
import logoKiky from '../../assets/Images/logo tulisan kiky.png'

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

  // State Loading & Micro-Steps Validasi Akun
  const [isValidating, setIsValidating] = useState(false)
  const [loadingStepText, setLoadingStepText] = useState('Menghubungkan ke server...')
  const [loadingProgress, setLoadingProgress] = useState(25)
  const [loginError, setLoginError] = useState('')

  const timerRef = useRef([])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timerRef.current.forEach(clearTimeout)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')

    if (!formData.username.trim() || !formData.password) return

    setIsValidating(true)
    setLoadingProgress(25)
    setLoadingStepText('Menghubungkan ke server...')

    // Animasi micro-steps halus selama proses validasi
    timerRef.current.forEach(clearTimeout)
    timerRef.current = [
      setTimeout(() => {
        setLoadingProgress(60)
        setLoadingStepText('Memvalidasi kredensial...')
      }, 400),
      setTimeout(() => {
        setLoadingProgress(85)
        setLoadingStepText('Menyinkronkan sesi akun...')
      }, 1000),
    ]

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !payload.status) {
        const validationMessage = payload.errors
          ? Object.values(payload.errors).flat()[0]
          : null
        throw new Error(validationMessage || payload.message || 'Username atau kata sandi tidak cocok.')
      }

      setLoadingProgress(100)
      setLoadingStepText('Login berhasil!')

      // Berikan jeda halus sebelum transisi
      setTimeout(() => {
        onLoginSuccess?.({ ...payload.data, token: payload.token })
      }, 350)
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        setLoginError('Tidak dapat terhubung ke server. Pastikan backend Laravel berjalan.')
      } else {
        setLoginError(error.message || 'Login gagal.')
      }
      setIsValidating(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between items-center bg-slate-950 font-sans text-white antialiased overflow-hidden selection:bg-teal-300 selection:text-slate-950">
      {/* Background Gambar Gudang Fullscreen (Desain Asli) */}
      <img
        src={bgWarehouse}
        alt="Gudang PT Solo Murni KIKY"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Dark Vignette & Gradient Overlay (Desain Asli) */}
      <div className="absolute inset-0 bg-[#071c30]/75 bg-gradient-to-t from-[#041220]/95 via-[#071c30]/70 to-[#071c30]/65 backdrop-blur-[2px]" />

      {/* Spacing Atas */}
      <div className="h-4" />

      {/* Center Container: Card Login Asli */}
      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center px-4 py-6">
        <div className="w-full rounded-3xl border border-white/25 bg-white/10 p-7 text-white shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-9">
          {/* Header Logo KIKY */}
          <div className="mb-5 flex justify-center">
            <img
              src={logoKiky}
              alt="KIKY Stationery"
              className="h-10 w-auto object-contain drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)] sm:h-12"
            />
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Masuk Akun
            </h2>
            <p className="mt-2 text-xs text-slate-200 sm:text-sm">
              Aplikasi Operasional Gudang &amp; Penjualan KIKY
            </p>
          </div>

          {/* Notifikasi Sukses Pendaftaran jika diarahkan dari Register */}
          {successMessage && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/95 p-3.5 text-xs text-emerald-800 shadow-xs">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
              <p className="font-medium leading-snug">{successMessage}</p>
            </div>
          )}

          {/* Notifikasi Error */}
          {loginError && (
            <div role="alert" className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/95 px-3.5 py-3 text-xs sm:text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field Username */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white">
                Username <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/60">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value })
                    setLoginError('')
                  }}
                  disabled={isValidating}
                  className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm py-3 pr-4 pl-10 text-sm text-white placeholder:text-white/50 focus:border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-200/20 transition-colors disabled:bg-white/5 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Field Kata Sandi */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white">
                Kata Sandi <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/60">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    setLoginError('')
                  }}
                  disabled={isValidating}
                  className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm py-3 pr-10 pl-10 text-sm text-white placeholder:text-white/50 focus:border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-200/20 transition-colors disabled:bg-white/5 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/60 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Ingat Saya & Lupa Kata Sandi */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isValidating}
                  className="h-4 w-4 rounded border-slate-300 text-teal-300 focus:ring-teal-300 cursor-pointer"
                />
                <span>Ingat Saya</span>
              </label>
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Silakan hubungi administrator IT untuk reset kata sandi.')
                }}
                className="font-semibold text-teal-200 hover:text-teal-100 hover:underline transition-colors"
              >
                Lupa Kata Sandi?
              </a>
            </div>

            {/* Tombol Submit Masuk ke Sistem dengan Inline Spinner */}
            <button
              type="submit"
              disabled={isValidating}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#16324f] py-3.5 text-sm font-medium text-white transition-all hover:bg-[#1c4264] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Link Register */}
            <div className="pt-3 text-center text-xs text-slate-200">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                disabled={isValidating}
                className="font-bold text-white hover:underline cursor-pointer disabled:opacity-50"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Loading Standar Modern & Menarik (Identik 100% dengan Register) */}
      {isValidating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[3px] p-4 animate-fadeIn">
          <div className="relative flex w-full max-w-[280px] flex-col items-center justify-center rounded-2xl bg-[#0f233a] p-6 text-white shadow-2xl border border-slate-700/60 overflow-hidden">
            {/* Top Glowing Progress Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-teal-300 to-sky-500 animate-pulse" />

            {/* Modern Dual-Ring Spinner dengan Center Core */}
            <div className="relative flex items-center justify-center my-2">
              <div className="h-12 w-12 rounded-full border-2 border-white/10" />
              <div className="absolute h-12 w-12 rounded-full border-2 border-transparent border-t-sky-400 border-r-teal-300 animate-spin" />
              <div className="absolute h-4 w-4 rounded-full bg-sky-400/30 animate-ping" />
              <div className="absolute h-2.5 w-2.5 rounded-full bg-sky-400" />
            </div>

            {/* Text Status Dinamis */}
            <h3 className="mt-3 text-sm font-semibold tracking-tight text-white">
              Memverifikasi Akun
            </h3>
            <p className="mt-1 text-xs text-slate-300 text-center min-h-[18px]">
              {loadingStepText}
            </p>

            {/* Smooth Micro-progress Bar */}
            <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-teal-300 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Hak Cipta di Bawah (Desain Asli) */}
      <footer className="relative z-10 w-full pb-4 text-center text-[11px] text-slate-300/80">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-white">PT SOLO MURNI CAB. BANDUNG</span>. Hak Cipta Dilindungi.
      </footer>
    </div>
  )
}
