import { useState, useEffect, useRef } from 'react'
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  Package,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import bgWarehouse from '../../assets/Images/background.jpeg'
import logoKiky from '../../assets/Images/logo tulisan kiky.png'

export default function Register({ onNavigateToLogin, onSwitchToLogin }) {
  // Dukung prop onNavigateToLogin maupun onSwitchToLogin
  const handleSwitchToLogin = onNavigateToLogin || onSwitchToLogin

  const [selectedDivision, setSelectedDivision] = useState('penjualan')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    domicile: '',
    position: '',
    branch: '',
    directSupervisor: '',
    password: '',
    confirmPassword: ''
  })

  const [isValidating, setIsValidating] = useState(false)
  const [loadingStepText, setLoadingStepText] = useState('Menghubungkan ke server...')
  const [loadingProgress, setLoadingProgress] = useState(25)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const timerRef = useRef([])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timerRef.current.forEach(clearTimeout)
    }
  }, [])

  const divisions = [
    { id: 'penjualan', label: 'Penjualan', icon: Store },
    { id: 'gudang', label: 'Gudang', icon: Package },
    { id: 'admin', label: 'Admin', icon: ShieldCheck }
  ]

  const activeDivisionLabel = divisions.find((d) => d.id === selectedDivision)?.label || 'Penjualan'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!agreed) {
      setErrorMessage('Silakan setujui Syarat & Ketentuan serta Kebijakan Privasi Kiky Stationery.')
      return
    }

    if (formData.password.length < 8) {
      setErrorMessage('Kata sandi minimal 8 karakter.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi!')
      return
    }

    setIsValidating(true)
    setLoadingProgress(25)
    setLoadingStepText('Menghubungkan ke server...')

    // Animasi micro-steps halus selama proses pendaftaran
    timerRef.current.forEach(clearTimeout)
    timerRef.current = [
      setTimeout(() => {
        setLoadingProgress(60)
        setLoadingStepText('Memvalidasi data formulir...')
      }, 400),
      setTimeout(() => {
        setLoadingProgress(85)
        setLoadingStepText('Menyiapkan akun Anda...')
      }, 1000),
    ]

    // Siapkan payload sesuai dengan API Laravel AuthController
    const username = formData.email.split('@')[0] || formData.fullName.toLowerCase().replace(/\s+/g, '')
    const payload = {
      nama_lengkap: formData.fullName,
      username: username,
      email: formData.email,
      no_telepon: formData.phone,
      domisili: formData.domicile,
      jabatan: formData.position,
      cabang: formData.branch,
      atasan_langsung: formData.directSupervisor,
      password: formData.password,
      divisi: selectedDivision
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok && data.status) {
        setLoadingProgress(100)
        setLoadingStepText('Pendaftaran berhasil! Mengalihkan ke login...')
        setSuccessMessage('Pendaftaran akun berhasil! Mengarahkan ke halaman login...')
        setTimeout(() => {
          if (handleSwitchToLogin) {
            handleSwitchToLogin({
              email: formData.email,
              username: username,
              division: selectedDivision,
              message: `Akun ${formData.fullName} (${activeDivisionLabel}) berhasil didaftarkan. Silakan login.`
            })
          }
        }, 800)
      } else {
        // Tampilkan pesan error dari Laravel
        let errMsg = data.message || 'Registrasi gagal. Silakan periksa kembali data Anda.'
        if (data.errors) {
          const firstErr = Object.values(data.errors)[0]
          if (Array.isArray(firstErr)) errMsg = firstErr[0]
        }
        setErrorMessage(errMsg)
        setIsValidating(false)
      }
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setErrorMessage('Tidak dapat terhubung ke server. Pastikan backend Laravel sedang berjalan.')
      } else {
        setErrorMessage(err.message || 'Terjadi kesalahan saat pendaftaran akun.')
      }
      setIsValidating(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full bg-white font-sans text-slate-800 antialiased selection:bg-[#1b2b44] selection:text-white overflow-x-hidden">

      {/* Kolom Kiri: Form Registrasi */}
      <div className="relative flex w-full flex-col justify-between px-6 py-8 sm:px-12 md:px-16 lg:w-1/2 lg:py-10 xl:px-20">
        <div className="relative z-10">
          {/* Header Logo KIKY */}
          <div className="mb-6 flex items-center">
            <div className="inline-flex items-center justify-center rounded-full border-[2px] border-slate-900 px-3.5 py-1 tracking-wider bg-white">
              <span className="text-xs font-black tracking-widest text-slate-900">KIKY</span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Daftar Akun Baru
            </h1>
            <p className="mt-1.5 text-xs text-slate-600 sm:text-sm">
              Pilih divisi Anda dan lengkapi data untuk mengakses sistem Kiky Stationery.
            </p>
          </div>

          {/* Notifikasi Pesan Error / Sukses */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form Registrasi */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Divisi Akses Section */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <label className="font-semibold tracking-wider text-slate-700 uppercase text-[11px]">
                  DIVISI AKSES <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-500">
                  Divisi Terpilih: <strong className="text-slate-800">{activeDivisionLabel}</strong>
                </span>
              </div>

              {/* Segmented Control Buttons */}
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200">
                {divisions.map((div) => {
                  const Icon = div.icon
                  const isSelected = selectedDivision === div.id
                  return (
                    <button
                      key={div.id}
                      type="button"
                      disabled={isValidating}
                      onClick={() => setSelectedDivision(div.id)}
                      className={`flex items-center justify-center gap-2 rounded-md py-2 text-xs font-medium transition-colors cursor-pointer min-h-[38px] ${isSelected
                        ? 'bg-white text-slate-900 shadow-xs font-semibold border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                        }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{div.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  disabled={isValidating}
                  placeholder="Masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44] transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Perusahaan / Pribadi */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  disabled={isValidating}
                  placeholder="Masukkan alamat email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44] transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Nomor Telepon & Domisili */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Nomor Telepon <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    disabled={isValidating}
                    placeholder="Contoh: 081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44] transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Domisili <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isValidating}
                    placeholder="Contoh: Bandung"
                    value={formData.domicile}
                    onChange={(e) => setFormData({ ...formData, domicile: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44] transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Jabatan & Cabang */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Jabatan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isValidating}
                    placeholder="Contoh: Staf Penjualan"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44] transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Cabang <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isValidating}
                    placeholder="Contoh: Cabang Bandung"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44] transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Atasan Langsung */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Atasan Langsung <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <UserCheck className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  disabled={isValidating}
                  placeholder="Masukkan nama atasan langsung"
                  value={formData.directSupervisor}
                  onChange={(e) => setFormData({ ...formData, directSupervisor: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44] transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Kata Sandi & Konfirmasi Sandi */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Kata Sandi */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Kata Sandi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    disabled={isValidating}
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-10 pl-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44] transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Sandi */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Konfirmasi Sandi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    disabled={isValidating}
                    placeholder="Ulangi kata sandi"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-10 pl-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1b2b44] focus:outline-none focus:ring-1 focus:ring-[#1b2b44] transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi sandi' : 'Tampilkan konfirmasi sandi'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox Syarat & Ketentuan */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                disabled={isValidating}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1b2b44] focus:ring-[#1b2b44] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                Saya menyetujui{' '}
                <span className="font-semibold text-slate-900 hover:underline">
                  Syarat &amp; Ketentuan
                </span>{' '}
                serta{' '}
                <span className="font-semibold text-slate-900 hover:underline">
                  Kebijakan Privasi
                </span>{' '}
                Kiky Stationery.
              </label>
            </div>

            {/* Tombol Submit Daftar Akun */}
            <button
              type="submit"
              disabled={isValidating}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b2b44] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#243856] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#1b2b44]/30 disabled:cursor-not-allowed disabled:opacity-75 cursor-pointer"
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <>
                  <span>Daftar Akun</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center text-xs text-slate-600 relative z-10">
          Sudah memiliki akun?{' '}
          <button
            type="button"
            onClick={handleSwitchToLogin}
            disabled={isValidating}
            className="font-bold text-[#1b2b44] hover:underline cursor-pointer disabled:opacity-50"
          >
            Masuk Sekarang
          </button>
        </div>

        {/* Footer Hak Cipta */}
        <footer className="mt-8 pt-4 text-center text-[11px] text-slate-500 border-t border-slate-100">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-700">PT SOLO MURNI CAB. BANDUNG</span>. Hak Cipta Dilindungi.
        </footer>
      </div>

      {/* Kolom Kanan: Gambar Background Gudang & Tulisan KIKY Pas Posisi Tengah Layar */}
      <div className="relative hidden lg:block lg:w-1/2 min-h-screen overflow-hidden bg-slate-950">
        {/* Background Foto Gudang */}
        <img
          src={bgWarehouse}
          alt="Gudang Kiky Stationery"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-slate-950/70" />

        {/* Logo KIKY di Tengah Layar Kanan */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8 pointer-events-none">
          <img
            src={logoKiky}
            alt="KIKY Stationery"
            className="w-96 sm:w-[28rem] lg:w-[32rem] max-w-full h-auto object-contain select-none"
          />
        </div>
      </div>

      {/* Modal Loading Standar Modern & Menarik (Sama Persis dengan Login) */}
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
              Mendaftarkan Akun
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
    </div>
  )
}
